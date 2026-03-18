/**
 * GR_TIME
 * 项目全局时间常量（单位：秒）
 * - 命名规则：
 *   - 超过 30 天的时间，用 `DAYS_` 开头，便于精确控制
 *   - 按天 / 小时 / 分钟 / 秒四大类分组，便于查找
 *   - 所有数值为秒数，统一计算单位
 */
export declare const GR_TIME: {
    /*** 天数（>30 天） ***/
    readonly DAYS_360: number;
    readonly DAYS_270: number;
    readonly DAYS_180: number;
    readonly DAYS_120: number;
    readonly DAYS_90: number;
    readonly DAYS_60: number;
    readonly DAYS_45: number;
    readonly DAYS_40: number;
    /*** 天数（≤30 天） ***/
    readonly DAYS_30: number;
    readonly DAYS_15: number;
    readonly DAYS_12: number;
    readonly DAYS_10: number;
    readonly DAYS_7: number;
    readonly DAYS_5: number;
    readonly DAYS_3: number;
    readonly DAYS_1: number;
    /*** 小时 ***/
    readonly HOURS_18: number;
    readonly HOURS_12: number;
    readonly HOURS_6: number;
    readonly HOURS_4: number;
    readonly HOURS_1: number;
    /*** 分钟 ***/
    readonly MINUTES_45: 2700;
    readonly MINUTES_30: 1800;
    readonly MINUTES_15: 900;
    readonly MINUTES_10: 600;
    readonly MINUTES_5: 300;
    readonly MINUTES_1: 60;
    /*** 秒 ***/
    readonly SECONDS_50: 50;
    readonly SECONDS_40: 40;
    readonly SECONDS_30: 30;
    readonly SECONDS_20: 20;
    readonly SECONDS_10: 10;
    readonly SECONDS_5: 5;
};
