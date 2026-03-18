import { ITextWithColor } from "@/interface/iweb3";
import {formatNumber_fromCommon} from "@/utils/format/number";

// 格式化价格，按不同区间控制小数位数
export const formatPrice_fromCommon_V1 = (price: number | string | null | undefined): string => {
    // 如果 price 为 null、undefined 或 0，返回默认值
    if (!price) return "$0.00";

    // 如果 price 是字符串，则转换为数字
    const numPrice: number = typeof price === "string" ? parseFloat(price) : price;

    // 小于 0.0001，保留 8 位小数
    if (numPrice < 0.0001) {
        return "$" + numPrice.toFixed(8);
    }
    // 小于 1，保留 6 位小数
    else if (numPrice < 1) {
        return "$" + numPrice.toFixed(6);
    }
    // 小于 10000，保留 5 位小数
    else if (numPrice < 10000) {
        return "$" + numPrice.toFixed(5);
    }
    // 10000 以上，添加千分位，并保留 2 位小数
    else {
        return (
            "$" +
            numPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
    }
};

// 根据交易类型格式化数值并设置颜色
export const formatValue_WithColor = (
    value: number | string | null | undefined,
    txType: string
): ITextWithColor => {
    // 如果无值，显示“-”，使用灰色
    if (!value) return { text: "-", color: "text-gray-500" };

    // 格式化数字（保留两位小数）
    const formattedValue = formatNumber_fromCommon(value, 2);

    // 根据交易类型设置颜色，buy 为绿色，其他为红色
    const color =
        txType.toLowerCase() === "buy" ? "text-green-500" : "text-red-500";

    return {
        text: formattedValue,
        color,
    };
};

// 格式化价格并返回带颜色的文本对象
export const formatPrice_WithColor = (price: number | string | null | undefined): ITextWithColor => {
    // 如果无价格数据，显示“-”，使用灰色
    if (!price) return { text: "-", color: "text-gray-500" };

    // 使用已封装的格式化函数
    const formattedPrice = formatPrice_fromCommon_V1(price);

    return {
        text: formattedPrice,
        color: "text-gray-200", // 默认显示颜色（可以根据需求调整）
    };
};

export const formatPrice_fromCommon_V2 = (price: number | string | null | undefined): string => {
    if (price == null || price === "" || isNaN(Number(price))) {
        return "$0";
    }

    const numPrice = typeof price === "number" ? price : parseFloat(price);

    if (numPrice < 0.000001) {
        return "$" + numPrice.toExponential(4);
    } else if (numPrice < 0.001) {
        return "$" + numPrice.toFixed(8);
    } else if (numPrice < 1) {
        return "$" + numPrice.toFixed(6);
    } else {
        return "$" + numPrice.toFixed(4);
    }
};

// 格式化 USD 金额字符串（支持 string 或 number 类型）
export const formatPrice_Usd = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === "") return "$0.00";

    const numValue: number =
        typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numValue)) return "$0.00"; // 避免传入非数字字符串

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numValue);
};


// 用适当的小数位格式化价格（原：Format price with appropriate decimal places）
export const formatPrice_fromInfo_v1 = (price: number | string | undefined | null): string => {
    if (price == null || price === "") return "$0";

    // 如果是字符串，尝试转成 number
    const numPrice: number = typeof price === "string" ? parseFloat(price) : price;

    if (isNaN(numPrice)) return "$0";

    if (numPrice < 0.00001) {
        return "$" + numPrice.toFixed(10).replace(/\.?0+$/, "");
    } else if (numPrice < 0.01) {
        return "$" + numPrice.toFixed(6);
    } else if (numPrice < 1000) {
        return "$" + numPrice.toFixed(4);
    } else {
        return (
            "$" +
            numPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
    }
};

export const formatPrice_fromInfo_v2 = (price: number | string | null | undefined): string => {
    if (price == null || price === "") return "$0";

    const numPrice: number = typeof price === "string" ? parseFloat(price) : price;

    if (isNaN(numPrice) || numPrice <= 0) return "$0";

    // Very small prices - use scientific notation
    if (numPrice < 0.000001) {
        return "$" + numPrice.toExponential(2);
    }

    // Small prices - dynamic decimals
    if (numPrice < 0.01) {
        const digits = Math.min(8, 2 + Math.abs(Math.floor(Math.log10(numPrice))));
        return "$" + numPrice.toFixed(digits);
    }

    // Medium prices - fewer decimals
    if (numPrice < 1000) {
        const digits = Math.max(2, 4 - Math.floor(Math.log10(numPrice)));
        return "$" + numPrice.toFixed(digits);
    }

    // Large prices - formatted with commas
    return "$" + numPrice.toLocaleString(undefined, {
        maximumFractionDigits: 2,
    });
};


// 根据报价令牌格式化令牌价格（原：Format token price in terms of the quote token）
export const formatPrice_Token = (price: number | string | undefined | null, symbol: string): string => {
    if (price == null || price === "") return "0";

    const numPrice: number = typeof price === "string" ? parseFloat(price) : price;

    if (isNaN(numPrice)) return "0";

    if (numPrice < 0.00001) {
        // return `${numPrice.toFixed(10).replace(/\.?0+$/, "")} ${symbol}`;
        // 保留小数点后最多12位
        return `${numPrice.toFixed(12).replace(/\.?0+$/, "")} ${symbol}`;
    } else {
        const parts = numPrice.toString().split(".");
        if (parts.length > 1) {
            // 保留小数点后最多6位
            // return `${parts[0]}.${parts[1].substring(0, 6)} ${symbol}`;
            // 保留小数点后最多10位
            return `${parts[0]}.${parts[1].substring(0, 10)} ${symbol}`;
            // 保留小数点后最多12位
            // return `${parts[0]}.${parts[1].substring(0, 12)} ${symbol}`;
        }
        return `${numPrice} ${symbol}`;
    }
};
