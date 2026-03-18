/**
 * 命名规则说明：
 * math + [Round|Cut] + [_OptionalSuffix] + [s2n|n2n] 表示从某类型 → number 的转换（带保留精度）
 *
 * 片段	    含义
 * mathCut	    非四舍五入，向下取整
 * mathRound	四舍五入
 * d2	        保留两位小数（decimal 2 位）
 * s2n	        string → number
 * n2n	        number → number
 * Percent	    百分比（自动乘以 100）
 */
// 合法数字的正则
const NUMERIC_REGULAR_EXPRESSION = /^-?\d+(\.\d+)?$/;

// 百分比上限值可提取常量
const MAX_PERCENT_RESULT = 1_000_000;

// 用判断函数：isValidNumericStr
function isValidNumericStr(input: string): boolean {
    return NUMERIC_REGULAR_EXPRESSION.test(input.trim());
}
//返回字符串的：取整（非四舍五入）
export function mathCut_ParseInt_s2n(input: string | null | undefined): number {
    if (typeof input !== 'string') return 0;

    const trimmed = input.trim();
    if (!trimmed) return 0;

    if (isValidNumericStr(trimmed)) {
        return Math.floor(parseFloat(trimmed));
    }
    return 0;
}

//返回number的：保留小数点后两位小数(四舍五入）
export function mathRound_ParseFloat_d2_s2n(input: string | null | undefined): number {
    if (typeof input !== 'string') return 0;

    const trimmed = input.trim();
    if (!trimmed) return 0;

    if (isValidNumericStr(trimmed)) {
        // ❌原先写法：toFixed返回的是字符串。但这里有问题：
        // 虽然 as unknown as number 强行告诉 TypeScript “我是 number”，但运行时返回的仍然是 string。
        // return parseFloat(trimmed).toFixed(2) as unknown as number;

        // ✅ 正确写法：toFixed(2) 返回 string，再 parseFloat 转为 number
        // 同样受：IEEE 754 精度影响，也加上 + Number.EPSILON

        // 另外：toFixed(2)在做截取的同时，也是做了：四舍五入，的
        return parseFloat((parseFloat(trimmed) + Number.EPSILON).toFixed(2));
    }
    return 0;
}

//返回数字的：保留小数点后两位小数(四舍五入）
export function mathRound_d2_n2n(input: number | null | undefined): number {
    if (typeof input !== 'number') return 0;
    /* 
    注意点一：
    input.toFixed(2) 会：
    把 number 四舍五入 到小数点后 2 位．但toFixed返回结果为 string
    然后 parseFloat(...) 会把这个字符串重新转换成 number
     */
    /* 
    注意点二：
    parseFloat((1.005).toFixed(2)) // ❗️返回 1，不是 1.01
    这背后的原因是：
    1.005 在 IEEE 754 浮点数表示中，并不是精确的 1.005，而是略小于它的一点点，例如：1.004999

    解决方法：＋Number.EPSILON
    Number.EPSILON 是 JS/TS 中一个隐藏但非常有用的“精度控制常量”，几乎不影响效率，却能显著提升数值精度的安全性。
    (Number.EPSILON 表示两个可区分浮点数之间的最小差值（约为 2.220446049250313e-16），在这个差值的范围内，可以认为两个浮点数是相等的。)
    Number.EPSILON 的开销：几乎没有性能成本，却能让你避免 90% 的四舍五入和比较 bug。
     */
    // return parseFloat(input.toFixed(2));
    return Math.round((input + Number.EPSILON) * 100) / 100;

}

//转换为百分比(扩大100倍)，保留小数点后两位（非四舍五入）
//传入：0.123456 ，返回：12.34
export function mathCut_Percent_d2_s2n(input: string | null | undefined): number {
    if (typeof input !== 'string') return 0;

    const trimmed = input.trim();
    if (!trimmed) return 0;

    if (isValidNumericStr(trimmed)) {
        const result = Math.floor(parseFloat(trimmed) * 10000) / 100;
        // 增加对超大值的保护，例如加个上限防止异常输入污染
        return result > MAX_PERCENT_RESULT ? 0 : result;

    }
    return 0;
}

//转换为百分比(扩大100倍)，并保留小数点后两位（四舍五入）
// 传入：0.123456 ，返回：12.35
export function mathRound_Percent_d2_s2n(input: string | null | undefined): number {
    if (typeof input !== 'string') return 0;

    const trimmed = input.trim();
    if (!trimmed) return 0;

    if (isValidNumericStr(trimmed)) {
        // 同样受：IEEE 754 精度影响，也加上 + Number.EPSILON
        return Math.round((parseFloat(trimmed) + Number.EPSILON) * 10000) / 100;
    }
    return 0;
}

// 把字符串安全转成数字，不是数字就返回 0
export const parseNumberOrZero = (s: string) => {
    const x = Number.parseFloat(s);
    return Number.isFinite(x) ? x : 0;
};

/**
 * 市值换算为百万单位，保留 2 位小数，小于 0.01 则取 0.01
 */
export function mathRound_CmcMillion_d2_n2n(cmc: number): number {
    // 非数字、Infinity、NaN 都直接回退到 0.01
    if (!Number.isFinite(cmc)) return 0.01;

    const millionValue = cmc / 1_000_000;
    return Math.max(0.01, mathRound_d2_n2n(millionValue));
}


// 改成用更稳健的函数

export const mathRound_Min001_d2_n2n = (x: number) => 
    Math.max(0.01, mathRound_d2_n2n(x));