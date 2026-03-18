export type ChainType = "solana" | "bsc" | "eth";
export declare function getChainFromId(id: string): ChainType | "unknown";
export type TCgTimeframeKey = "m5" | "m15" | "m30" | "h1" | "h6" | "h24";
export interface ICgPoolTransactions {
    buys: number;
    sells: number;
    buyers: number;
    sellers: number;
}
export interface ICgPoolAttributes {
    base_token_price_usd: string;
    base_token_price_native_currency: string;
    quote_token_price_usd: string;
    quote_token_price_native_currency: string;
    base_token_price_quote_token: string;
    quote_token_price_base_token: string | null;
    address: string;
    name: string;
    pool_created_at: string;
    fdv_usd: string;
    market_cap_usd: string | null;
    price_change_percentage: Record<TCgTimeframeKey, string>;
    transactions: Record<TCgTimeframeKey, ICgPoolTransactions>;
    volume_usd: Record<TCgTimeframeKey, string>;
    reserve_in_usd: string;
    locked_liquidity_percentage: string | null;
}
export interface ICgTokenReference {
    id: string;
    type: "token";
}
export interface ICgDexReference {
    id: string;
    type: "dex";
}
export interface ICgPoolRelationships {
    base_token: {
        data: ICgTokenReference;
    };
    quote_token: {
        data: ICgTokenReference;
    };
    dex: {
        data: ICgDexReference;
    };
}
export interface ICgPoolItem {
    id: string;
    type: "pool";
    attributes: ICgPoolAttributes;
    relationships: ICgPoolRelationships;
}
export interface ICgPoolListResponse {
    data: ICgPoolItem[];
}
export interface ICgTokenAttributes {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image_url: string;
    coingecko_coin_id: string;
    total_supply: string;
    price_usd: string;
    fdv_usd: string;
    total_reserve_in_usd: string;
    volume_usd: {
        h24: string;
    };
    market_cap_usd: string;
}
export interface ICgPoolReference {
    id: string;
    type: 'pool';
}
export interface ICgTokenRelationships {
    base_token: {
        data: ICgTokenReference;
    };
    quote_token: {
        data: ICgTokenReference;
    };
    dex: {
        data: ICgPoolReference;
    };
}
export interface IcgTokenItem {
    id: string;
    type: 'token';
    attributes: ICgTokenAttributes;
    relationships: ICgTokenRelationships;
}
export interface IcgTokenListResponse {
    data: IcgTokenItem[];
}
