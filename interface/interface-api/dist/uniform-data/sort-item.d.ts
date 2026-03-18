import { TTimeframe_PriceChange, TQtType, T3State } from "@gr/interface-base";
import { TPlatformType } from "@gr/interface-base";
export type TSortField_Client = 'c_t_iso' | 'c_t_s' | 'price' | 'holders.total' | 'fdv' | 'cmc' | 'single_liq' | 'tranx_1h.all_trader' | 'tranx_1h.ind_trader' | 'vol.5m' | 'vol.1h' | 'vol.6h' | 'vol.24h' | 'lv_0_hot_vol.5m' | 'lv_0_hot_vol.1h' | 'lv_0_hot_vol.6h' | 'lv_0_hot_vol.24h' | 'lv_1_hot_vol.5m' | 'lv_1_hot_vol.1h' | 'lv_1_hot_vol.6h' | 'lv_1_hot_vol.24h' | 'lv_2_hot_vol.5m' | 'lv_2_hot_vol.1h' | 'lv_2_hot_vol.6h' | 'lv_2_hot_vol.24h';
export type TSortField_Server = TSortField_Client | 'hot.hc' | 'hot.current_hc' | 'hot.h_time';
export interface IDuplicateName {
    total: number;
    cmc_index: number;
    c_t_sec_index: number;
}
export interface IHot {
    hc: number;
    l_z_hc: number;
    l_z_time: number;
    i_time: number;
    h_time: number;
}
export interface IGrTokenSortItem_Client {
    ca: string;
    pa: string;
    name: string;
    quote_name: string;
    symbol: string;
    chain: string;
    desc: string;
    c_t_iso: string;
    c_t_sec: number;
    image_url: string;
    price: string;
    supply: string;
    holders: IHolders;
    fdv: number;
    cmc: number;
    liq: ILiq;
    dev: IDev;
    meta: IMeta;
    update_state: IUpdateState;
    other_state: IOtherState;
    trading_features: ITradingFeatures;
    common_safe: ICommonSafe;
    evm_safe: IEvmSafe | null;
    spl_safe: ISplSafe | null;
    price_change: Record<TTimeframe_PriceChange, number>;
    tranx: Record<TQtType, ITransactions>;
    vol: Record<TQtType, number>;
    lv_0_factor: number;
    lv_1_factor: number;
    lv_2_factor: number;
    lv_0_hot_vol: Record<TQtType, number>;
    lv_1_hot_vol: Record<TQtType, number>;
    lv_2_hot_vol: Record<TQtType, number>;
    lv_0_formula: Record<TQtType, string>;
    lv_1_formula: Record<TQtType, string>;
    lv_2_formula: Record<TQtType, string>;
    cmc_m_arr: number[];
    cmc_m_l_u_sec: number;
}
export interface ITransactions {
    buys: number;
    sells: number;
    all_trader: number;
    buyers: number;
    sellers: number;
    ind_trader: number;
}
export interface IMeta {
    x: string;
    site: string;
    tg: string;
    is_verified_x: T3State;
    is_verified_site: T3State;
}
export interface IUpdateState {
    price_l_u_sec: number;
    holders_total_l_u_sec: number;
    cmc_l_u_sec: number;
}
export interface IOtherState {
    is_hot_1h: T3State;
    is_cto: T3State;
    is_dex_pay: T3State;
    is_has_links: T3State;
}
export interface IDev {
    creator_aa: string;
    creator_balance: string;
    creator_percent: string;
    is_add_pos: T3State;
    is_reduce_pos: T3State;
    is_clear_pos: T3State;
}
export interface ILiq {
    single_liq: number;
    is_add_liq: T3State;
    is_reduce_liq: T3State;
    is_remove_liq: T3State;
}
export interface ITradingFeatures {
    raw_real_trading_ratio: Record<TQtType, number>;
    raw_vol_cmc_ratio: Record<TQtType, number>;
    raw_vol_avg_ratio: Record<TQtType, number>;
    is_wash_trading: T3State;
    is_high_turnover_qt: Record<TQtType, T3State>;
    is_high_turnover_initial: T3State;
    is_market_manipulated: T3State;
}
export interface ICommonSafe {
    cluster_concentration_ratio: number;
    new_address_ratio: number;
    same_source_of_funds_ratio: number;
    same_create_time_ratio: number;
    is_has_misleading_icon: T3State;
    is_has_misleading_name: T3State;
    duplicate_name_72h_create: IDuplicateName;
    duplicate_name_24h_hot: IDuplicateName;
}
export interface IEvmSafe {
    is_scam: T3State;
    is_honeypot: T3State;
    is_honeypot_with_same_creator: T3State;
    is_trust_list: T3State;
    is_anti_whale: T3State;
    is_anti_whale_modifiable: T3State;
    is_can_take_back_ownership: T3State;
    is_cannot_buy: T3State;
    is_cannot_sell_all: T3State;
    is_external_call: T3State;
    is_hidden_owner: T3State;
    is_in_dex: T3State;
    is_mint_able: T3State;
    is_open_source: T3State;
    is_proxy: T3State;
    is_white_listed: T3State;
    is_black_listed: T3State;
    is_selfdestruct: T3State;
    is_trading_cooldown: T3State;
    is_transfer_pausable: T3State;
    is_transfer_tax: T3State;
    is_slippage_modifiable: T3State;
    is_personal_slippage_modifiable: T3State;
    owner_address: string;
    owner_balance: number;
    owner_change_balance: number;
    owner_percent: number;
    is_ownership_renounced: T3State;
    is_lp_locked: T3State;
    buy_tax: number;
    sell_tax: number;
    trans_tax: number;
}
export interface ISplSafe {
    create_tx: string;
    possible_created_on: TPlatformType | null;
    is_scam: T3State;
    is_pump: T3State;
    is_fake_pump: T3State;
    is_bonk: T3State;
    is_fake_bonk: T3State;
    is_creators_malicious_address: T3State;
    is_balance_mutable_authority: T3State;
    is_clos_able: T3State;
    is_default_account_state: T3State;
    is_default_account_state_upgradable: T3State;
    is_freez_able: T3State;
    is_metadata_mutable: T3State;
    is_mint_able: T3State;
    is_transfer_fee: T3State;
    is_transfer_fee_upgradable: T3State;
    is_transfer_hook: T3State;
    is_transfer_hook_upgradable: T3State;
    is_black_listed: T3State;
    is_trusted_token: T3State;
}
export interface IHolders {
    total: number;
    top_10_percent: number;
    top_100_percent: number;
    change_1h: number;
    swap_percent: number;
    whale_holders: number;
    small_holders: number;
    smart_holders: number;
    kol_holders: number;
}
export interface IGrTokenSortItem_ClientResponse {
    results: number;
    grTokenSortItems: IGrTokenSortItem_Client[];
}
export interface IGrTokenSortItem_Server extends IGrTokenSortItem_Client {
    hot: IHot;
}
export interface IGrTokenSortPageResult_Client {
    maxPage: number;
    list: IGrTokenSortItem_Client[];
}
export interface IGrTokenSortPageResult_Server {
    maxPage: number;
    list: IGrTokenSortItem_Server[];
}
