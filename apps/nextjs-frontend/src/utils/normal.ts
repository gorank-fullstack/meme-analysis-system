// utils.ts
export const isServer = () => typeof window === 'undefined';

export function isAccessType(accessStrs: string[], value: string): boolean {
    return accessStrs.includes(value);
}