// 先定义 timeFrameMap，且加 const assertion
export const timeFrameMap = {
    "5m": "5min",
    "1h": "1h",
    "4h": "4h",
    "24h": "24h",
} as const;

// period 只能是下面这几个
export type TimeFramePeriod = keyof typeof timeFrameMap; // "5m" | "1h" | "4h" | "24h"

// apiPeriod 只能是 timeFrameMap 映射后的值
export type ApiTimePeriod = typeof timeFrameMap[TimeFramePeriod]; // "5min" | "1h" | "4h" | "24h"

// 格式化“xx时间前”
// export const formatTimeAgo_fromCommon = (dateString: string | null | undefined): string => {
/**
 * 将传入时间格式化为简洁的相对时间字符串（英文单位：s/m/h/d）
 *
 * 用于显示 Token 上线后经过的时间（如："45s"、"10m"、"3h"、"2d"）
 *
 * - 小于 1 分钟       => "58s"         （秒）
 * - 小于 1 小时       => "10m"         （分钟）
 * - 小于 24 小时      => "3h"          （小时）
 * - 大于等于 1 天     => "2d"          （天）
 *
 * ⚠️ 与 v2 不同之处：
 * - 本函数为最简版本，仅显示单一单位（不含组合单位）
 * - 适合对时长精度要求不高、视觉更简洁的场景
 *
 * @param dateString 可传入时间字符串、时间戳、Date 对象等（推荐 ISO 字符串）
 * @returns 相对时间字符串（单位：s / m / h / d）
 */
export const formatTimeAgo_fromCommon_v1 = (
    dateString: string | number | Date | null | undefined
): string => {
    if (!dateString) return "";

    const date = new Date(dateString).getTime(); // 转为时间戳
    /* 
    注意：new Date() 对象创建，执行效率比：比 Date.now() 慢好几倍
    Date.now() 是极轻量的 native 函数，执行时间 < 0.01ms，属于纳秒级别操作；
     */
    const now = Date.now(); // 当前时间戳（单位：ms）
    const diffSec = Math.floor((now - date) / 1000);

    /* if (diffSec < 60) return `${diffSec}s ago`;
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`; */
    if (diffSec < 60) return `${diffSec}s`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
    return `${Math.floor(diffSec / 86400)}d`;
};


/**
 * 格式化 Token 上线时间为相对时间字符串（精确到秒/分/小时/天）
 *
 * 用于 Token 排行榜中「时间」栏显示 Token 上线时长。
 * 不同时间段返回格式如下：
 * - 小于 1 分钟       => "58s"         （秒）
 * - 小于 1 小时       => "25m 32s"      （分+秒）
 * - 小于 24 小时      => "3h 28m"       （小时+分）
 * - 大于等于 1 天     => "2d"          （天）
 *
 * @param dateString 可传入时间字符串、时间戳、Date 对象等（推荐 ISO 字符串）
 * @returns 相对时间字符串（单位：s / m / h / d）
 */
export const formatTimeAgo_fromCommon_v2 = (
    dateString: string | number | Date | null | undefined
): string => {
    if (!dateString) return "";

    const date = new Date(dateString).getTime(); // 转为时间戳
    /* 
    注意：new Date() 对象创建，执行效率比：比 Date.now() 慢好几倍
    Date.now() 是极轻量的 native 函数，执行时间 < 0.01ms，属于纳秒级别操作；
     */
    const now = Date.now(); // 当前时间戳（单位：ms）
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) {
        return `${diffSec}s`;
    }

    const diffMin = Math.floor(diffSec / 60);
    const remainSec = diffSec % 60;

    if (diffMin < 60) {
        return `${diffMin}m ${remainSec}s`;
    }

    const diffHour = Math.floor(diffMin / 60);
    const remainMin = diffMin % 60;

    if (diffHour < 24) {
        return `${diffHour}h ${remainMin}m`;
    }

    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d`;
};

export const formatTimeAgo_useSeconds_v2 = (
    seconds: number
): string => {
    // if (!dateString) return "";

    // const date = new Date(dateString).getTime(); // 转为时间戳
    /* 
    注意：new Date() 对象创建，执行效率比：比 Date.now() 慢好几倍
    Date.now() 是极轻量的 native 函数，执行时间 < 0.01ms，属于纳秒级别操作；
     */
    const now = Math.floor(Date.now()/1000); // 当前时间戳（单位：ms）
    // const diffSec = Math.floor((now - date) / 1000);
    const diffSec = now - seconds;

    if (diffSec < 60) {
        return `${diffSec}s`;
    }

    const diffMin = Math.floor(diffSec / 60);
    const remainSec = diffSec % 60;

    if (diffMin < 60) {
        return `${diffMin}m ${remainSec}s`;
    }

    const diffHour = Math.floor(diffMin / 60);
    const remainMin = diffMin % 60;

    if (diffHour < 24) {
        return `${diffHour}h ${remainMin}m`;
    }

    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d`;
};


export const formatAge = (timestamp: number | null | undefined): string => {
    if (!timestamp) return "N/A";

    const now = Date.now();
    const diffMs = now - timestamp;
    const diffSec = diffMs / 1000;

    if (diffSec < 60) return Math.floor(diffSec) + "s";
    if (diffSec < 3600) return Math.floor(diffSec / 60) + "m";
    if (diffSec < 86400) return Math.floor(diffSec / 3600) + "h";
    if (diffSec < 2592000) return Math.floor(diffSec / 86400) + "d";
    if (diffSec < 31536000) return Math.floor(diffSec / 2592000) + "mo";
    return Math.floor(diffSec / 31536000) + "y";
};

/**
 * 将 ISO 时间字符串转换为简洁的时间差格式（如："2d 3h ago" 或 "5h 24m ago"）
 * 
 * 用于展示 token 上线多久，若超过 1 天则显示为 d+h，若小于 1 天则显示为 h+m。
 * 
 * @param dateString ISO 格式时间字符串（如 "2025-08-05T16:30:00Z"）
 * @returns 时间差字符串（如："2d 3h ago"）
 */

export const formatTimeAgo_fromIsoTime = (dateString: string | undefined | null): string => {
    if (!dateString) return "";

    const date = new Date(dateString).getTime(); // 转为时间戳
    const now = Date.now(); // 当前时间戳（单位：ms）

    const diffMs: number = now - date;
    const diffSec: number = Math.floor(diffMs / 1000);
    const diffMin: number = Math.floor(diffSec / 60);
    const diffHours: number = Math.floor(diffMin / 60);
    const diffDays: number = Math.floor(diffHours / 24);

    if (diffDays > 0) {
        return `${diffDays}d ${diffHours % 24}h ago`;
    } else {
        return `${diffHours}h ${diffMin % 60}m ago`;
    }
};