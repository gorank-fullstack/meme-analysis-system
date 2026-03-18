import { T3State } from "./index";

// === 公共基础别名 ===
export type NumericString = `${number}`;   // 形如 "123.45" 的数字字符串
export type Bool01 = 0 | 1;                 // 0/1 表示布尔
export type Status01 = '0' | '1';           // '0'/'1' 表示布尔（字符串版）


// ========= helpers =========

// 将未知外部值统一到 T3State: -1(未知) / 0(否/安全) / 1(是/风险)
// export type T3State = -1 | 0 | 1;

/* toT3
作用：把任何单个值（number | boolean | string | null | undefined | 其他）统一转换为 T3State（-1, 0, 1）。
范围：通用型，必须手动传入一个值。

toT3(1)           // 1
toT3('true')      // 1
toT3(false)       // 0
toT3(null)        // -1
 */
export function toT3(v: unknown): T3State {
    // number 直接归一
    if (typeof v === 'number' && Number.isFinite(v)) {
        if (v > 0) return 1;
        if (v === 0) return 0;
        return -1; // 负数 或 非法按未知
    }

    // boolean
    if (typeof v === 'boolean') return v ? 1 : 0;

    // string: 先特判常见字面量，再尝试数字化
    if (typeof v === 'string') {
        const s = v.trim().toLowerCase();
        if (s === '1' || s === 'true') return 1;
        if (s === '0' || s === 'false' || s === '') return 0;
        if (s === '-1') return -1;
        const n = Number(s);
        if (Number.isFinite(n)) return toT3(n);
        return -1; // 非法字符串
    }

    // null / undefined / 其他类型
    return -1;
}

/* toT3FromStatus
作用：省事，用在那些GoPlus 或其他 API 返回的对象，字段格式是 { status: "1" | "0" | ... } 的情况。

范围：只针对带 status 属性的对象，不用你写 obj?.status 这一坨代码。

toT3FromStatus({ status: '1' }) // 1
toT3FromStatus({ status: '0' }) // 0
toT3FromStatus(null)            // -1

 */
export function toT3From_Status(obj: { status?: unknown } | null | undefined): T3State {
    return toT3(obj?.status);
}

// 将 { status, authority } 转换为 T3State
export function toT3From_Status_Authority(
    obj: { status?: unknown; authority?: any[] | null } | null | undefined
): T3State {
    const t3: T3State = toT3(obj?.status);

    // 安全取数组长度
    const authLen = Array.isArray(obj?.authority) ? obj!.authority.length : 0;

    if (authLen === 0 && t3 === 0) {
        return 0;
    } else if (authLen > 0 && t3 === 1) {
        return 1;
    }
    return -1;
}


// 针对 { status, metadata_upgrade_authority } 的固定形态
export function toT3From_Status_MetadataUpgradeAuthority(
    obj: { status?: unknown; metadata_upgrade_authority?: any[] | null } | null | undefined
): T3State {
    const t3: T3State = toT3(obj?.status);
    const authLen = Array.isArray(obj?.metadata_upgrade_authority)
        ? obj!.metadata_upgrade_authority.length
        : 0;

    if (authLen === 0 && t3 === 0) return 0;
    if (authLen > 0 && t3 === 1) return 1;
    return -1;
}


// 专门负责把 true/false 转成 T3State（0 或 1）
/* 
Presence表示：在场，存在
Presence 这种命名，一般强调的不是值本身的 true/false，而是某种东西“是否存在/具备”，而且这个存在性通常是经过计算或组合判断得出的，比如：

toT3From_Presence(
    Array.isArray(rawGpSplTokenSecurityInfo.transfer_hook) &&
    rawGpSplTokenSecurityInfo.transfer_hook.length > 0
);
 */
export function toT3From_Presence(exists: boolean): T3State {
    return exists ? 1 : 0;
}

// 工具：hasKeys() 专门负责“对象是否有可枚举属性”的判断
export function hasKeys(obj: unknown): boolean {
    return obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0;
}

