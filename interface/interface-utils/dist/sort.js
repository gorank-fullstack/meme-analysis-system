"use strict";
// src/utils/getNestedValue.ts
/*
总结核心逻辑：
    支持从 "a.b.c" 形式的路径中安全取值。
    返回值优先为数字，其次为字符串，最后是默认值。
    自动识别“数值字符串”并转为数字参与排序。
    这个函数在表格排序、动态列比较、过滤器系统中非常常用
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNestedValue_Old2_Del = exports.getNestedValue_Old1_Del = exports.getNestedValue = void 0;
/**
* 获取嵌套对象中的值，支持 string (包括string 类型的：数值、时间) 和 number 类型
* @param obj 要读取的对象
* @param path 例如 "info.name" 或 "stats.volume"
* @param defaultValue 默认返回值，默认是空字符串
*/
const getNestedValue = (obj, path, defaultValue = "") => {
    const referenceTimestamp = 3786883199; // 基准时间：2089-12-31 23:59:59
    const keys = path.split("."); // 将路径用点号拆成层级数组，如 "info.volume" → ["info", "volume"]
    let value = obj; // 初始化从整个对象开始读取
    for (const key of keys) {
        // 如果中途遇到 null、undefined 或非对象，就直接返回默认值
        if (value === null || value === undefined || typeof value !== "object") {
            return defaultValue;
        }
        value = value[key]; // 向下一层取值
    }
    // 如果最终是 number 类型，直接返回
    if (typeof value === "number")
        return value;
    // 如果是字符串，进一步处理
    if (typeof value === "string") {
        const trimmed = value.trim();
        // 1. 优先判断：如果是数值字符串 → 转换为数值
        // ****************　高风险提示：　****************
        // 直接使用：parseFloat(trimmed)然后用：!isNaN(parsed)判断会有问题
        // 例如出现：trimmed为：“2023-04-14T17:21:11Z”，也会被判断为数字符串，此时parsed被解释为：2023
        /* const parsed = parseFloat(trimmed);
        if (!isNaN(parsed)) {
          console.log('!isNaN(parsed):path=', path,'||trimmed=',trimmed,'||parsed=',parsed);
          return parsed;
        } */
        // **************************************************
        // 1. 优先判断：是否是“纯数值字符串”（用正则过滤）
        if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
            return parseFloat(trimmed);
        }
        // 2. 然后再判断：检查是否是 ISO 时间字符串
        const isoDate = new Date(trimmed);
        // T + Z 是 ISO 时间的特征（避免误判 "2023"）
        if (!isNaN(isoDate.getTime()) && trimmed.includes("T") && trimmed.includes("Z")) {
            console.log('isoDate():path=', path, '||trimmed=', trimmed, '||isoDate=', isoDate);
            const isoTimestampInSeconds = Math.floor(isoDate.getTime() / 1000);
            //使用基准时间减去ISO时间的秒数，得到相对于基准时间的时间差（升序排序时，距离现在越近，排得越前）
            return referenceTimestamp - isoTimestampInSeconds;
        }
        // 3. 否则返回原始字符串
        return trimmed;
    }
    // 其它情况（如布尔、对象、数组等）都返回默认值
    return defaultValue;
};
exports.getNestedValue = getNestedValue;
const getNestedValue_Old1_Del = (obj, path, defaultValue = "") => {
    const keys = path.split("."); // 将路径用点号拆成层级数组，如 "info.volume" → ["info", "volume"]
    let value = obj; // 初始化从整个对象开始读取
    for (const key of keys) {
        // 如果中途遇到 null、undefined 或非对象，就直接返回默认值
        if (value === null || value === undefined || typeof value !== "object") {
            return defaultValue;
        }
        value = value[key]; // 向下一层取值
    }
    // 如果最终是 number 类型，直接返回
    if (typeof value === "number")
        return value;
    // 如果是字符串，尝试解析成数字
    if (typeof value === "string") {
        const trimmed = value.trim(); // 去除前后空白
        const parsed = parseFloat(trimmed); // 尝试转换为浮点数
        // 是合法数字"string"类型 → 如，字符串格式的数字："123.45"
        if (!isNaN(parsed)) {
            // 返回解析后的数字
            return parsed;
        }
        return trimmed; // 否则返回原始字符串
    }
    // 其它情况（如布尔、对象、数组等）都返回默认值
    return defaultValue;
};
exports.getNestedValue_Old1_Del = getNestedValue_Old1_Del;
//弃用。不支持"数值字符串","时间字符串"
const getNestedValue_Old2_Del = (obj, path, defaultValue = "") => {
    const keys = path.split(".");
    let value = obj;
    for (const key of keys) {
        if (value === null || value === undefined || typeof value !== "object") {
            return defaultValue;
        }
        value = value[key];
    }
    return typeof value === "number" || typeof value === "string"
        ? value
        : defaultValue;
};
exports.getNestedValue_Old2_Del = getNestedValue_Old2_Del;
