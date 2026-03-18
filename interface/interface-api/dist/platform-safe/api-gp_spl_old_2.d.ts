export interface IGpSplTokenSecurityResponse {
    code: number;
    message: string;
    result: Record<string, IGpSplTokenSecurityInfo>;
}
export interface IGpSplTokenSecurityInfo {
    balance_mutable_authority: IGpSplStatusAuthority;
    closable: IGpSplStatusAuthority;
    creators: any[];
    default_account_state: string;
    default_account_state_upgradable: IGpSplStatusAuthority;
    dex: IGpSplDexInfo[];
    freezable: IGpSplStatusAuthority;
    holder_count: string;
    holders: IGpSplHolder[];
    lp_holders: IGpSplLpHolder[];
    metadata: IGpSplTokenMeta;
    metadata_mutable: IGpSplStatusAuthority;
    mintable: IGpSplStatusAuthority;
    non_transferable: string;
    total_supply: string;
    transfer_fee: Record<string, any>;
    transfer_fee_upgradable: IGpSplStatusAuthority;
    transfer_hook: any[];
    transfer_hook_upgradable: IGpSplStatusAuthority;
    trusted_token: number;
}
export interface IGpSplStatusAuthority {
    authority: string[];
    status: string;
}
export interface IGpSplDexInfo {
    burn_percent: number;
    day: IGpSplDexStat;
    dex_name: string;
    fee_rate: string;
    id: string;
    lp_amount: string | null;
    month: IGpSplDexStat;
    open_time: string;
    price: string;
    tvl: string;
    type: 'Standard' | 'Concentrated' | string;
    week: IGpSplDexStat;
}
export interface IGpSplDexStat {
    price_max: string;
    price_min: string;
    volume: string;
}
export interface IGpSplHolder {
    account: string;
    balance: string;
    is_locked: number;
    locked_detail: IGpSplLockDetail[];
    percent: string;
    tag: string;
    token_account: string;
}
export interface IGpSplLockDetail {
    amount: string;
    end_time: string;
    opt_time: string;
}
export interface IGpSplLpHolder {
    account: string;
    balance: string;
    is_locked: number;
    locked_detail: IGpSplLockDetail[];
    percent: string;
    tag: string;
    token_account: string;
}
export interface IGpSplTokenMeta {
    description: string;
    name: string;
    symbol: string;
    uri: string;
}
