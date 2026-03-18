export type ChainType = "solana" | "bsc" | "eth";

export function getChainFromId(id: string): ChainType | "unknown" {
    if (id.startsWith("solana_")) return "solana";
    if (id.startsWith("bsc_")) return "bsc";
    if (id.startsWith("eth_")) return "eth";
    return "unknown";
}
// 注：此文件，支持的api访问列表：
// 支持：trending_pools、new_pools
// 支持链类型：eth bsc solana
// https://api.geckoterminal.com/api/v2/networks/solana/trending_pools?page=1&duration=1h
// https://api.geckoterminal.com/api/v2/networks/eth/new_pools?page=1
// https://api.geckoterminal.com/api/v2/networks/solana/new_pools?page=1

// 时间段枚举定义
export type TCgTimeframeKey = "m5" | "m15" | "m30" | "h1" | "h6" | "h24";


//------------------------------- Pools --------------------------------------------------------------
// export const allowedDurations = new Set(["5m", "1h", "6h", "24h"]);
// export type ValidDuration = "5m" | "1h" | "6h" | "24h";
//   交易信息结构
export interface ICgPoolTransactions {
    buys: number;
    sells: number;
    buyers: number;
    sellers: number;
}

// attributes 字段结构
export interface ICgPoolAttributes {
    base_token_price_usd: string;
    base_token_price_native_currency: string;
    quote_token_price_usd: string;
    quote_token_price_native_currency: string;
    base_token_price_quote_token: string;
    // quote_token_price_base_token: string;
    quote_token_price_base_token: string | null; // 可能为 null
    address: string;
    name: string;
    pool_created_at: string;
    fdv_usd: string;
    market_cap_usd: string | null;
    price_change_percentage: Record<TCgTimeframeKey, string>;
    transactions: Record<TCgTimeframeKey, ICgPoolTransactions>;
    volume_usd: Record<TCgTimeframeKey, string>;
    reserve_in_usd: string;

    // locked_liquidity_percentage,字段是：/networks/eth/pools/:ca ,特有的字段    
    locked_liquidity_percentage: string | null;
}



export interface ICgTokenReference {
    id: string;     // solana_... / eth_... / bsc_...
    type: "token";
}

export interface ICgDexReference {
    id: string; // dex 名，如 raydium / uniswap_v2 / meteora 等
    type: "dex";
}

// relationships 字段结构
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

// 单个池对象结构  
export interface ICgPoolItem {
    id: string; // 例如 eth_0xabc..., solana_xxx..., bsc_0x...
    type: "pool";
    attributes: ICgPoolAttributes;
    relationships: ICgPoolRelationships;
}

// 顶级接口定义
export interface ICgPoolListResponse {
    data: ICgPoolItem[];
}

//------------------------------- Tokens --------------------------------------------------------------

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

// token 列表

export interface ICgTokenRelationships {    
    base_token: {
        data: ICgTokenReference;
    },
    quote_token: {
        data: ICgTokenReference;
    },
    dex: {
        data: ICgPoolReference;
    },
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
//单个 token 对象
/* export interface IcgTokenItemResponse {
    data: IcgTokenItem;
} */


