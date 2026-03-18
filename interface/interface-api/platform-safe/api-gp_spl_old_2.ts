//  顶层结构定义
export interface IGpSplTokenSecurityResponse {
    code: number;
    message: string;
    result: Record<string, IGpSplTokenSecurityInfo>;
}

//   Token 安全性详情
export interface IGpSplTokenSecurityInfo {
    balance_mutable_authority: IGpSplStatusAuthority;
    closable: IGpSplStatusAuthority;
    creators: any[]; // 可以根据实际补充类型
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

//   通用结构：包含 authority 和 status 的对象
export interface IGpSplStatusAuthority {
    authority: string[];
    status: string;
}

//   DEX 结构体定义
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
// 持币用户结构体定义
export interface IGpSplHolder {
    account: string;
    balance: string;
    is_locked: number;
    locked_detail: IGpSplLockDetail[];
    percent: string;    //Gp返回持币,是未放大100倍的．要加"%"号，需要再X100)
    tag: string;
    token_account: string;
}

export interface IGpSplLockDetail {
    amount: string;
    end_time: string;
    opt_time: string;
}

//    LP Holder 结构（与 Holder 相似）
export interface IGpSplLpHolder {
    account: string;
    balance: string;
    is_locked: number;
    locked_detail: IGpSplLockDetail[];
    percent: string;
    tag: string;
    token_account: string;
}

//    Token Metadata 信息
export interface IGpSplTokenMeta {
    description: string;
    name: string;
    symbol: string;
    uri: string;
}


