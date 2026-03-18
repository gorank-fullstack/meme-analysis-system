export interface ISolSplTokenListResponse {
    success: boolean;
    data: ISolSplTokenItem[];
    metadata: Record<string, any>;
}
export interface ISolSplTokenTopListData {
    total: number;
    items: ISolSplTokenItem[];
}
export interface ISolSplTokenTopListResponse {
    success: boolean;
    data: ISolSplTokenTopListData;
    metadata: Record<string, any>;
}
export interface ISolSplTokenTrendingResponse {
    success: boolean;
    data: ISolSplTokenItem[];
    metadata: Record<string, any>;
}
export interface ISolSplTokenDailyPrice {
    date: number;
    price: number;
}
export interface ISolSplTokenPriceHistory {
    token_address: string;
    prices: ISolSplTokenDailyPrice[];
}
export interface ISolSplTokenPriceMultiResponse {
    success: boolean;
    data: ISolSplTokenPriceHistory[];
    metadata: Record<string, any>;
}
export interface ISolSplTokenMetaResponse {
    success: boolean;
    data: ISolSplTokenItem;
    metadata: Record<string, any>;
}
export interface ISolSplTokenMeta {
    name: string;
    symbol: string;
    description: string;
    image: string;
    showName?: boolean | string;
    createdOn?: string;
    twitter?: string;
    telegram?: string;
    website?: string;
}
export interface ISolSplTokenItem {
    address: string;
    name: string;
    symbol: string;
    icon?: string;
    decimals?: number;
    holder: number;
    creator: string;
    create_tx: string;
    created_time: number;
    first_mint_tx?: string;
    first_mint_time?: number;
    metadata: ISolSplTokenMeta | null;
    mint_authority: string | null;
    freeze_authority: string | null;
    supply: string;
    price?: number;
    volume_24h?: number;
    market_cap?: number;
    market_cap_rank?: number;
    price_change_24h?: number;
    gr_cache_t_sec: number;
}
export interface ISolSplTokenMetaMultiResponse {
    success: boolean;
    data: ISolSplTokenItem[];
    metadata: Record<string, any>;
}
