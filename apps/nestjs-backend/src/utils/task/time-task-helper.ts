// utils/time-task-helper.ts
// TimeTaskHelper实现：@Cron的容错函数．实现“仅在目标时间 + 容错秒数范围内执行一次”的逻辑
export class TimeTaskHelper {
  private static lastExecutedKeys = new Set<string>();

  static async executeOncePerMinuteFromCron(
    taskName: string,
    cronExpr: string,
    fn: () => Promise<void> | void,
  ) {
    const options = this.parseCronToOptions(cronExpr);
    return this.executeOncePerMinute(taskName, options, fn);
  }

  // parseCronToOptions✅ 解释cron表达式，转换为参数．仅支持单分钟、单小时/间隔小时
  /* 
  支持:秒数范围窗口 0-9、5,10;（但不支持：间隔:秒值 *\/2）
  支持:单个/多个：分钟值 如：1,31；同时也支持：间隔:分钟值 *\/2
  支持:单个/多个：小时值 如：18,23；同时也支持：间隔:小时值 *\/2
   */
  // 表达式	解析结果
  // '0-9 58 */2 * * *'	minute=58, hourModulo=2, allowedSecondsWindow=10
  // '* 58 23 * * *'	minute=58, hour=23（不会设置 modulo），window=60
  // '5,10 58 */2 * * *'	minute=58, window=2（第 5 秒、第 10 秒）
  // '0 15 * * * *'	minute=15, window=1（只第 0 秒）
  private static parseCronToOptions(cronExpr: string): {
    // targetMinute: number;       //
    targetMinutes: number[];    // 支持多个分钟值，只有当前 minute === targetMinutes[] 中的一个，就执行
    targetHourModulo?: number;  //用来判断：当前小时 hour % N === 0 是否成立
    // targetHourExact?: number;   //用来判断当前小时是否是指定的固定小时数
    targetHourExactList?: number[]; // 支持多个小时值，用来判断当前小时是否是指定的固定小时数
    allowedSecondsWindow?: number; //在当前分钟内，任务在哪些秒数内允许被执行
  } {
    const parts = cronExpr.trim().split(' ');
    if (parts.length !== 6) {
      throw new Error(`[TimeTaskHelper] Invalid cron expression: ${cronExpr}`);
    }

    const [secField, minField, hourField] = parts;

    // ✅ 解析分钟：支持多个值（如 '1,31'）
    /* const targetMinutes = minField.split(',').map((v) => parseInt(v)).filter((n) => !isNaN(n));
    if (targetMinutes.length === 0) {
      throw new Error(`[TimeTaskHelper] Invalid minute: ${minField}`);
    } */
    // ✅ 解析分钟：支持多个值（如 '1,31'）、每N分钟（如 '*/2'）
    let targetMinutes: number[] = [];

    if (minField.startsWith('*/')) {
      const interval = parseInt(minField.slice(2));
      if (!isNaN(interval) && interval > 0) {
        // 在一个小时的 0~59 分钟中，哪些分钟满足 m % N === 0，就作为目标分钟
        // 这里和：每n小时，求余等于0的判断不一样，但效果是一样的
        targetMinutes = Array.from({ length: 60 }, (_, i) => i).filter((m) => m % interval === 0);
      }
    } else {
      targetMinutes = minField
        .split(',')
        .map((v) => parseInt(v))
        .filter((n) => !isNaN(n) && n >= 0 && n < 60);
    }

    if (targetMinutes.length === 0) {
      throw new Error(`[TimeTaskHelper] Invalid minute: ${minField}`);
    }

    // ✅ 解析小时：支持 */N 和指定小时（23）
    let targetHourModulo: number | undefined = undefined;
    // let targetHourExact: number | undefined = undefined;
    let targetHourExactList: number[] | undefined = undefined;

    // ✅ 解析小时（支持 '*/2'）
    if (hourField.startsWith('*/')) {
      const mod = parseInt(hourField.slice(2));
      if (!isNaN(mod)) targetHourModulo = mod;
    } else {
      // 支持解析：单个小时值（如 '23'）或多个小时值（如 '23,24'）
      const hourList = hourField.split(',').map(s => parseInt(s)).filter(n => !isNaN(n));
      if (hourList.length > 0) {
        targetHourExactList = hourList;
      }
    }
    // 指定小时（23）
    /* else if (/^\d+$/.test(hourField)) {
      const exact = parseInt(hourField);
      if (!isNaN(exact)) targetHourExact = exact;
    } */

    // ✅ 解析秒数范围，用于 allowedSecondsWindow
    let allowedSecondsWindow = 1;

    if (secField === '*') {
      allowedSecondsWindow = 60; // 每秒都触发
    } else if (secField.includes('-')) {
      const [start, end] = secField.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        allowedSecondsWindow = end - start + 1;
      }
    } else if (secField.includes(',')) {
      // 例如：'5,10,12'
      const count = secField.split(',').map(Number).filter(n => !isNaN(n)).length;
      if (count > 0) allowedSecondsWindow = count;
    } else {
      // 单一秒值如 '0'
      const val = parseInt(secField);
      if (!isNaN(val)) allowedSecondsWindow = 1;
    }

    // 对 allowedSecondsWindow 非法范围做健壮性处理
    allowedSecondsWindow = Math.max(1, Math.min(allowedSecondsWindow, 60));

    // 禁止同时设置 targetHourModulo 与 targetHourExact
    // 两个字段语义互斥（一个是“间隔”，一个是“固定值”）
    // 按现有解析逻辑（if...else if）这两个永远不会同时赋值，仅作防御性保护
    if (
      (targetHourModulo !== undefined) &&
      (targetHourExactList !== undefined && targetHourExactList.length > 0)
    ) {
      throw new Error(`[TimeTaskHelper:cronExpr=${cronExpr}] Cannot define both targetHourModulo and targetHourExactList.`);
    }

    // 加一个容错兜底提示（可选）
    // 这不是错误，只是提示开发者：你没有限制小时，可能每小时都会跑，是否合理。
    if (
      targetHourModulo === undefined &&
      (!targetHourExactList || targetHourExactList.length === 0)
    ) {
      console.warn(`[TimeTaskHelper:cronExpr=${cronExpr}] No hour condition defined – task may run every hour.`,new Date());
    }

    return {
      // targetMinute,
      targetMinutes,
      targetHourModulo,
      // targetHourExact,
      targetHourExactList,
      allowedSecondsWindow,
    };
  }

  /**
 * 在指定时间窗口内，每分钟只执行一次
 * @param taskName 用于标识任务唯一性（如 'hotTokenJob'）
 * @param options 配置项（分钟、小时等）
 * @param fn 真正要执行的函数（异步/同步均可）
 */
  static async executeOncePerMinute(
    taskName: string,
    options: {
      // targetMinute: number;
      targetMinutes: number[];
      targetHourModulo?: number;
      // targetHourExact?: number;
      targetHourExactList?: number[];
      allowedSecondsWindow?: number;
    },
    fn: () => Promise<void> | void,
  ): Promise<void> {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const {
      // targetMinute,
      targetMinutes,
      targetHourModulo,
      // targetHourExact,
      targetHourExactList,
      allowedSecondsWindow = 10,
    } = options;

    // 每分钟只执行一次的精度
    const currentKey = `${taskName}:${hour}:${minute}`;

    // （可选扩展）统一 currentKey 精度：包括秒（如果你要做 finer 级别的任务）
    // 比如：未来考虑“每 5 秒内只执行一次”，
    // const currentKey = `${taskName}:${hour}:${minute}:${Math.floor(second / allowedSecondsWindow)}`;

    //旧：仅支持单分钟，不支持：多个分钟
    // const inTargetMinute = minute === targetMinute;
    const inTargetMinute = targetMinutes.includes(minute);

    // 下面的判断太难理解了，不推荐
    /* const inTargetHour =
      (targetHourModulo === undefined || hour % targetHourModulo === 0) &&
      (targetHourExact === undefined || hour === targetHourExact); */
    // 改为这个判断容易理角【可读性极高，意图明确--推荐】
    // 如果两者都没设置 → inTargetHour = true，表示“小时不限制” → ✅ 完全合理。
    let inTargetHour = true;
    if (targetHourExactList && targetHourExactList.length > 0) {
      inTargetHour = targetHourExactList.includes(hour);
    } else if (targetHourModulo !== undefined) {
      inTargetHour = hour % targetHourModulo === 0;
    }

    const inSecondWindow = second >= 0 && second < Math.max(1, Math.min(allowedSecondsWindow, 60));

    if (!inTargetMinute || !inTargetHour || !inSecondWindow) return;
    if (this.lastExecutedKeys.has(currentKey)) return;

    this.lastExecutedKeys.add(currentKey);

    setTimeout(() => {
      this.lastExecutedKeys.delete(currentKey);
    }, 60_000);

    await fn();
  }
}
