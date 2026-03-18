export declare function mathCut_ParseInt_s2n(input: string | null | undefined): number;
export declare function mathRound_ParseFloat_d2_s2n(input: string | null | undefined): number;
export declare function mathRound_d2_n2n(input: number | null | undefined): number;
export declare function mathCut_Percent_d2_s2n(input: string | null | undefined): number;
export declare function mathRound_Percent_d2_s2n(input: string | null | undefined): number;
export declare const parseNumberOrZero: (s: string) => number;
/**
 * 市值换算为百万单位，保留 2 位小数，小于 0.01 则取 0.01
 */
export declare function mathRound_CmcMillion_d2_n2n(cmc: number): number;
export declare const mathRound_Min001_d2_n2n: (x: number) => number;
