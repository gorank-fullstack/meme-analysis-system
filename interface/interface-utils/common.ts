// 判断是否是“空值”
export const isNullish = (v: unknown): v is null | undefined => v == null; // 仅 null/undefined
export const toLowerTrim = (s: string) => s.trim().toLowerCase();
