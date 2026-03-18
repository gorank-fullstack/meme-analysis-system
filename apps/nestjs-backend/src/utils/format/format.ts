export function safeAssign<
    T extends Record<string, any>,
    K extends keyof T
>(target: T, key: K, value: T[K]) {
    if (value !== null && value !== undefined) {
        target[key] = value;
        // console.log('w=',target);
    }
}

/* 
使用示例：
const token = { name: 'wHYPE / SOL' };
const sourceName = gpSolTokenSecurityInfo.metadata?.name;

assignIfNameIsPairSlash(token, sourceName);
 */
export function assignIfNameIsPairSlash(
    target: { name: string },
    sourceName: string | undefined | null
): void {
    if (
        target.name.includes(' / ') &&
        sourceName !== undefined &&
        sourceName !== null &&
        sourceName !== ''
    ) {
        target.name = sourceName;
    }
}

/* 
这个函数的目标是：

仅在 target[key] 是「未赋值或空字符串」的情况下，才将 sourceValue 赋值给 target[key]。

泛型解释
T extends object：泛型 T 表示任何对象。
K extends keyof T：泛型 K 表示 T 的一个合法字段名。
target: T：要修改的目标对象。
key: K：要判断并可能赋值的字段。
sourceValue: T[K] | undefined | null：备选值，可以是这个字段类型或 undefined/null。

const token = {
  symbol: '',
  name: 'ETH'
};

const metadata = {
  symbol: 'WETH',
  name: 'Wrapped Ether'
};

assignIfEmpty(token, 'symbol', metadata.symbol);
// token.symbol === 'WETH'

assignIfEmpty(token, 'name', metadata.name);
// 不执行赋值，因为 token.name 已有值
 */
export function assignIfEmpty_Old<T extends object, K extends keyof T>(
    target: T,
    key: K,
    sourceValue: T[K] | undefined | null
): void {
    const currentValue = target[key];
    if ((currentValue === undefined || currentValue === null || currentValue === '') &&
        sourceValue !== undefined && sourceValue !== null && sourceValue !== '') {
        target[key] = sourceValue;
    }
}

// 判断为空对象、null、undefined
export function isNilOrEmptyObject(val: any): boolean {
    return val == null || (typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length === 0);
}

/* 
    isEmpty行为说明：
        对 string 类型：只有空字符串 '' 被视为“空”。
        对 number 和 boolean 类型：只在 undefined 或 null 时返回 true，其它值（例如 0、false）都不算“空”。
 */
export function isEmpty(value: string | number | boolean | undefined | null): boolean {
    if (typeof value === 'string') {
        return value === '';
    }
    return value === undefined || value === null;
}

// 判断，非空
export function isNotEmpty(value: string | number | boolean | undefined | null): boolean {
    if (typeof value === 'string') {
        return value !== '';
    }
    return value !== undefined && value !== null;
}

//此　assign_If_Target_Empty　函数
//一般用于【首次赋值】．需判断源值(sourceValue)不为空，并且判断目标值(target[key])是否为""．只有目标值为""时，才赋值
// sourceValue 仅支持 string | undefined | null
export function assign_If_Target_Empty<T extends object, K extends keyof T>(
    target: T,
    key: K,
    sourceValue: string | undefined | null
): void {
    const currentValue = target[key];

    const isCurrentEmpty = currentValue === undefined || currentValue === null || currentValue === '';
    const isSourceValid = sourceValue !== undefined && sourceValue !== null && sourceValue !== '';

    if (isCurrentEmpty && isSourceValid) {
        target[key] = sourceValue as T[K];
    }
}
/* export function assign_If_Target_Empty_old<T extends object, K extends keyof T>(
    target: T,
    key: K,
    // sourceValue: T[K] | undefined | null
    sourceValue: T[K] | number | undefined | null
): void {
    const currentValue = target[key];

    const isCurrentEmpty = currentValue === undefined || currentValue === null || currentValue === '';
    const isSourceValid = sourceValue !== undefined && sourceValue !== null && sourceValue !== '';

    if (isCurrentEmpty && isSourceValid) {
        if (typeof sourceValue === 'number') {
            // 强制转换 number 为字符串再赋值
            target[key] = sourceValue.toString() as T[K];
        } else {
            target[key] = sourceValue;
        }
    }
} */

//此　assign_If_Target_Zero　函数
//一般用于【首次赋值】．需判断源值(sourceValue)不为　0，并且判断目标值(target[key])是否为　0．只有目标值为　0　时，才赋值
// sourceValue 仅支持 number | undefined | null
export function assign_If_Target_Zero<T extends Record<K, number | undefined | null>, K extends keyof T>(
    target: T,
    key: K,
    sourceValue: number | undefined | null
): void {
    const currentValue = target[key];

    const isCurrentEmpty = currentValue === undefined || currentValue === null || currentValue === 0;
    const isSourceValid = sourceValue !== undefined && sourceValue !== null && sourceValue !== 0;

    if (isCurrentEmpty && isSourceValid) {
        target[key] = sourceValue as T[K];
    }
}

// 此 assign_If_Target_NegOne 函数
// 一般用于【首次赋值】．需判断源值(sourceValue)不为 -1，并且判断目标值(target[key])是否为 -1．
// 只有目标值为 -1 时，才赋值
// sourceValue 仅支持 number | undefined | null
export function assign_If_Target_NegOne<
    T extends Record<K, number | undefined | null>,
    K extends keyof T
>(
    target: T,
    key: K,
    sourceValue: number | undefined | null
): void {
    const currentValue = target[key];

    const isCurrentUnset = currentValue === undefined || currentValue === null || currentValue === -1;
    const isSourceValid = sourceValue !== undefined && sourceValue !== null && sourceValue !== -1;

    if (isCurrentUnset && isSourceValid) {
        target[key] = sourceValue as T[K];
    }
}


//此　assign_If_Source_NotEmpty　函数
//一般用于【后续更新】．只判断源值(sourceValue)不为空，不判断目标值(target[key])是否为""
export function assign_If_Source_NotEmpty<T extends object, K extends keyof T>(
    target: T,
    key: K,
    sourceValue: T[K] | number | undefined | null
): void {
    const currentValue = target[key];

    const isTargetValid = currentValue !== undefined && currentValue !== null;
    const isSourceValid = sourceValue !== undefined && sourceValue !== null && sourceValue !== '';

    if (isTargetValid && isSourceValid) {
        // 这里不用：if (typeof sourceValue === 'number') {...}，
        // 当　sourceValue 是 number 类型时，保持原始 number 类型赋值（而不是强制转为字符串）
        target[key] = sourceValue as T[K];
    }
}



export function isPriceMissing(price: any): boolean {
    return price === undefined || price === null;
}

// 获取 UTC 的 8 位字符串格式（YYYYMMDD）的 TypeScript 实现：
export const getTodayAsUTCString = (): string => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始
    const day = now.getUTCDate().toString().padStart(2, '0');

    return `${year}${month}${day}`; // 返回 '20250430' 格式的字符串
};