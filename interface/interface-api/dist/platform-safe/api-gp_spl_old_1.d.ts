import { NumericString, Bool01, Status01 } from '@gr/interface-base';
export type Pubkey = string;
export type UriString = string;
export type UnixTimeString = `${number}`;
export type DexPoolType = 'Standard' | 'Concentrated' | (string & {});
export interface IGpSplTokenSecurityResponse {
    code: number;
    message: string;
    result: Record<Pubkey, IGpSplTokenSecurityInfo>;
}
export interface IGpSplStatusAuthority {
    authority: Pubkey[];
    status: Status01;
}
export interface IGpSplCreator {
    address: Pubkey;
    malicious_address: Bool01;
}
export interface IGpSplLockDetail {
    amount: NumericString;
    end_time: UnixTimeString;
    opt_time: UnixTimeString;
}
export interface IGpSplBaseHolder {
    account: Pubkey;
    balance: NumericString;
    is_locked: Bool01;
    locked_detail: IGpSplLockDetail[];
    percent: NumericString;
    tag: string;
    token_account: Pubkey;
}
export type IGpSplHolder = IGpSplBaseHolder;
export type IGpSplLpHolder = IGpSplBaseHolder;
export interface IGpSplDexStat {
    price_max: NumericString;
    price_min: NumericString;
    volume: NumericString;
}
export interface IGpSplDexInfo {
    burn_percent: number;
    day: IGpSplDexStat;
    dex_name: string;
    fee_rate: NumericString;
    id: string;
    lp_amount: NumericString | null;
    month: IGpSplDexStat;
    open_time: UnixTimeString;
    price: NumericString;
    tvl: NumericString;
    type: DexPoolType;
    week: IGpSplDexStat;
}
export interface IGpSplTokenMeta {
    description: string;
    name: string;
    symbol: string;
    uri: UriString;
}
export interface IGpSplTokenSecurityInfo {
    balance_mutable_authority: IGpSplStatusAuthority;
    closable: IGpSplStatusAuthority;
    creators: IGpSplCreator[];
    default_account_state: Status01 | string;
    default_account_state_upgradable: IGpSplStatusAuthority;
    freezable: IGpSplStatusAuthority;
    holder_count: NumericString;
    holders: IGpSplHolder[];
    lp_holders: IGpSplLpHolder[];
    metadata: IGpSplTokenMeta;
    metadata_mutable: IGpSplStatusAuthority;
    mintable: IGpSplStatusAuthority;
    non_transferable: Status01;
    total_supply: NumericString;
    transfer_fee: Record<string, unknown>;
    transfer_fee_upgradable: IGpSplStatusAuthority;
    transfer_hook: unknown[];
    transfer_hook_upgradable: IGpSplStatusAuthority;
    trusted_token: Bool01;
}
