
// 格式化数字，加入千分位逗号，保留指定的小数位
export const formatNumber_fromCommon = (
    num: number | string | null | undefined, // 支持数字、字符串、null 或 undefined 输入
    decimals: number = 0                     // 默认保留 0 位小数
): string => {
    // 如果 num 是 undefined 或 null，返回默认值 "0"
    if (num === undefined || num === null) return "0";

    // 将字符串类型转换为数字
    const parsedNum = typeof num === "string" ? parseFloat(num) : num;

    // 使用 toLocaleString 格式化：带千分位并保留固定小数位
    return parsedNum.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

export const formatPercentage = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === "") return "0%";

    const numValue: number =
        typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numValue)) return "0%";

    return new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numValue / 100); // 转换为小数再格式化为百分比
};

// 不支持大负数
// 格式化带有K、M、B后缀的大数字（原：Format large numbers with K, M, B suffixes）
export const formatNumber_fromInfo_v1 = (num: number | string | undefined | null): string => {
    if (num == null || num === "") return "0";

    const numValue: number = typeof num === "string" ? parseFloat(num) : num;

    if (isNaN(numValue)) return "0";

    /* Gpt:
    1_000_000_000 这样的写法在 JavaScript 和 TypeScript 中是合法的，称为 数字分隔符（Numeric Separators），用于提高长数字的可读性。
    分隔符 _ 不会影响数值本身的运算结果；仅在数值字面量中使用，不能用于字符串或计算表达式中间；
    不能出现在数值的开头或结尾、十六进制前缀后或多个连续位置；
    这是 ES2021 (ECMAScript 2021) 的标准，Node.js 12+ 和现代浏览器都已支持。
     */
    if (numValue >= 1_000_000_000) {
        return (numValue / 1_000_000_000).toFixed(1) + "B";
    } else if (numValue >= 1_000_000) {
        return (numValue / 1_000_000).toFixed(1) + "M";
    } else if (numValue >= 1_000) {
        return (numValue / 1_000).toFixed(1) + "K";
    } else {
        return numValue.toLocaleString();
    }
};

//支持：大负数
export const formatNumber_fromInfo_v2 = (num: number | string | undefined | null): string => {
    if (num == null || num === "") return "0";

    const numValue: number = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(numValue)) return "0";

    const absValue = Math.abs(numValue); // 取绝对值用于缩写判断
    let formatted: string;

    if (absValue >= 1_000_000_000) {
        formatted = (absValue / 1_000_000_000).toFixed(1) + "B";
    } else if (absValue >= 1_000_000) {
        formatted = (absValue / 1_000_000).toFixed(1) + "M";
    } else if (absValue >= 1_000) {
        formatted = (absValue / 1_000).toFixed(1) + "K";
    } else {
        formatted = absValue.toLocaleString();
    }

    return numValue < 0 ? `-${formatted}` : formatted;
};

// 格式百分比更改（原：Format percentage changes）
export const formatPercentChange = (value: number | undefined | null): string => {
    if (value == null) return "-";
    return (value >= 0 ? "+" : "") + value.toFixed(2) + "%";
};

// 计算进度条比率（原：Calculate ratio for progress bars）
export const calculateRatio = (a: number | undefined | null, b: number | undefined | null): number => {
    if (!a || !b || a + b === 0) return 0.5; // 默认返回 50%
    return a / (a + b);
};



