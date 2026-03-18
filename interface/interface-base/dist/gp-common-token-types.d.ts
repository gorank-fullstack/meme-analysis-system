import { T3State } from "./index";
export type NumericString = `${number}`;
export type Bool01 = 0 | 1;
export type Status01 = '0' | '1';
export declare function toT3(v: unknown): T3State;
export declare function toT3From_Status(obj: {
    status?: unknown;
} | null | undefined): T3State;
export declare function toT3From_Status_Authority(obj: {
    status?: unknown;
    authority?: any[] | null;
} | null | undefined): T3State;
export declare function toT3From_Status_MetadataUpgradeAuthority(obj: {
    status?: unknown;
    metadata_upgrade_authority?: any[] | null;
} | null | undefined): T3State;
export declare function toT3From_Presence(exists: boolean): T3State;
export declare function hasKeys(obj: unknown): boolean;
