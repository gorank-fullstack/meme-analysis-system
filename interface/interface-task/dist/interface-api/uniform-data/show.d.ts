export type TChainName = "sol" | "eth" | "bsc";
export type TQtType = "5m" | "1h" | "6h" | "24h";
export type TTimeframe_PriceChange = "1h" | "6h" | "24h";
export type TTabType_Server = "trending_pools" | "new_pools";
export type TTabType_Client = "hot" | "new";
export type TChainQtKey = "sol_5m" | "sol_1h" | "sol_6h" | "sol_24h" | "eth_5m" | "eth_1h" | "eth_6h" | "eth_24h" | "bsc_5m" | "bsc_1h" | "bsc_6h" | "bsc_24h";
export declare const SUPPORT_CHAIN: TChainName[];
export declare const SUPPORT_QT: TQtType[];
export declare const SUPPORT_QT_FILE_LIST: TQtType[];
export declare const SUPPORT_QT_CACHE_LIST: TQtType[];
export declare function isTChainName(val: string): val is TChainName;
export declare function isTTabTypeServer(tab: string): tab is TTabType_Server;
export declare function isTTabTypeClient(tab: string): tab is TTabType_Client;
export declare function isTQtType(val: string): val is TQtType;
export interface ITransactions {
    buys: number;
    sells: number;
    all_trader: number;
    buyers: number;
    sellers: number;
    ind_trader: number;
}
export interface IMainLinks {
    telegram?: string;
    twitter?: string;
    website?: string;
}
export interface IState {
    isPump: boolean;
    isHot_1h: boolean;
    isCto: boolean;
    isDexPay: boolean;
    hasLinks: boolean;
}
export interface IAddress {
    aa: string;
    balance: string;
    percent: string;
}
export interface IDev {
}
export interface IEvmSafe {
    is_scam: number;
    is_ownership_renounced: number;
    is_mintable: number;
    is_open_source: number;
    is_white_listed: number;
    is_black_listed: number;
    is_anti_whale: number;
    is_lp_locked: number;
    buy_tax: number;
    sell_tax: number;
    trans_tax: number;
}
export interface ISplSafe {
    is_mint_discard: number;
    is_mintable: number;
    is_black_listed: number;
}
export interface ISafe_Del {
    possibleSpam: boolean;
    isVerifiedContract: boolean;
    isValidated: number;
    mint_authority: string | null;
    freeze_authority: string | null;
}
export interface IHolders {
    total: number;
    top10_percent: number;
    change_1h: number;
    swap_percent: number | null;
}
export type TSortField_Client = 'c_t_iso' | 'c_t_s' | 'price' | 'holders.total' | 'fdv' | 'cmc' | 'single_liq' | 'tranx_1h.all_trader' | 'tranx_1h.ind_trader' | 'vol.5m' | 'vol.1h' | 'vol.6h' | 'vol.24h' | 'h_vol.5m' | 'h_vol.1h' | 'h_vol.6h' | 'h_vol.24h';
export type TSortField_Server = TSortField_Client | 'hot.hc' | 'hot.current_hc' | 'hot.h_time';
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
    type: string;
    c_t_iso: string;
    c_t_s: number;
    image_url: string;
    price: string;
    holders: IHolders;
    fdv: number;
    cmc: number | null;
    single_liq: number;
    links: IMainLinks;
    state: IState;
    evm_safe: IEvmSafe | null;
    spl_safe: ISplSafe | null;
    dev: IAddress;
    dev_op: string;
    price_change: Record<TTimeframe_PriceChange, number>;
    tranx: Record<TQtType, ITransactions>;
    vol: Record<TQtType, number>;
    h_vol: Record<TQtType, number>;
    h_vol_formula: Record<TQtType, string>;
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
