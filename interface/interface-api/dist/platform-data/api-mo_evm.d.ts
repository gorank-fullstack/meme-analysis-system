export interface IMoEvmPair {
    token_address: string;
    token_name: string;
    token_symbol: string;
    token_logo: string | null;
    token_decimals: string;
    pair_token_type: 'token0' | 'token1';
    liquidity_usd: number;
}
export interface IMoEvmTokenPair {
    exchange_address: string;
    exchange_name: string | null;
    exchange_logo: string | null;
    pair_label: string;
    pair_address: string;
    usd_price: number;
    usd_price_24hr: number;
    usd_price_24hr_percent_change: number;
    usd_price_24hr_usd_change: number;
    liquidity_usd: number;
    inactive_pair: boolean;
    base_token: string;
    quote_token: string;
    volume_24h_native: number | null;
    volume_24h_usd: number | null;
    pair: IMoEvmPair[];
}
export interface IMoEvmTokenPairsResponse {
    page_size: number;
    page: number;
    pairs: IMoEvmTokenPair[];
}
export interface IMoEvmChangeOverTime {
    "5min": number;
    "1h": number;
    "4h": number;
    "24h": number;
}
export interface IMoEvmTokenPairStats {
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    tokenLogo: string;
    pairCreated: string;
    pairLabel: string;
    pairAddress: string;
    exchange: string;
    exchangeAddress: string;
    exchangeLogo: string;
    exchangeUrl: string;
    currentUsdPrice: string;
    currentNativePrice: string;
    totalLiquidityUsd: string;
    pricePercentChange: IMoEvmChangeOverTime;
    liquidityPercentChange: IMoEvmChangeOverTime;
    buys: IMoEvmChangeOverTime;
    sells: IMoEvmChangeOverTime;
    totalVolume: IMoEvmChangeOverTime;
    buyVolume: IMoEvmChangeOverTime;
    sellVolume: IMoEvmChangeOverTime;
    buyers: IMoEvmChangeOverTime;
    sellers: IMoEvmChangeOverTime;
}
export interface IMoEvmTokenLinks {
    discord?: string;
    medium?: string;
    reddit?: string;
    telegram?: string;
    twitter?: string;
    website?: string;
    github?: string;
    bitbucket?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
    email?: string;
    moralis?: string;
}
export interface IMoEvmTokenMeta {
    address: string;
    address_label: string | null;
    name: string;
    symbol: string;
    decimals: string;
    logo: string;
    logo_hash: string | null;
    thumbnail: string;
    total_supply: string;
    total_supply_formatted: string;
    fully_diluted_valuation: string;
    block_number: string;
    validated: number;
    created_at: string;
    possible_spam: boolean;
    verified_contract: boolean;
    categories: string[];
    links: IMoEvmTokenLinks;
    security_score: number | null;
    description: string;
    circulating_supply: string;
    market_cap: string;
    gr_cache_t_sec: number;
}
export type IMoEvmTokenMetaList = IMoEvmTokenMeta[];
export interface IMoEvmHolderItem {
    balance: string;
    balance_formatted: string;
    is_contract: boolean;
    owner_address: string;
    owner_address_label: string | null;
    entity: string | null;
    entity_logo: string | null;
    usd_value: string;
    percentage_relative_to_total_supply: number;
}
export interface IMoEvmHolderResponse {
    cursor: string;
    page: number;
    page_size: number;
    result: IMoEvmHolderItem[];
}
export interface IMoEvmHolderChangeItem {
    change: number;
    changePercent: number;
}
export interface IMoEvmHolderChange {
    ["5min"]: IMoEvmHolderChangeItem;
    ["1h"]: IMoEvmHolderChangeItem;
    ["6h"]: IMoEvmHolderChangeItem;
    ["24h"]: IMoEvmHolderChangeItem;
    ["3d"]: IMoEvmHolderChangeItem;
    ["7d"]: IMoEvmHolderChangeItem;
    ["30d"]: IMoEvmHolderChangeItem;
}
export interface IMoEvmHolderSupplyLevel {
    supply: string;
    supplyPercent: number;
}
export interface IMoEvmHolderSupply {
    top10: IMoEvmHolderSupplyLevel;
    top25: IMoEvmHolderSupplyLevel;
    top50: IMoEvmHolderSupplyLevel;
    top100: IMoEvmHolderSupplyLevel;
    top250: IMoEvmHolderSupplyLevel;
    top500: IMoEvmHolderSupplyLevel;
}
export interface IMoEvmHolderDistribution {
    whales: number;
    sharks: number;
    dolphins: number;
    fish: number;
    octopus: number;
    crabs: number;
    shrimps: number;
}
export interface IMoEvmHoldersByAcquisition {
    swap: number;
    transfer: number;
    airdrop: number;
}
export interface IMoEvmHolderInsights {
    totalHolders: number;
    holdersByAcquisition: IMoEvmHoldersByAcquisition;
    holderChange: IMoEvmHolderChange;
    holderSupply: IMoEvmHolderSupply;
    holderDistribution: IMoEvmHolderDistribution;
}
export interface IMoEvmKlineItem {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    trades: number;
}
export interface IMoEvmKlineApiResponse {
    page: number;
    cursor: string | null;
    pairAddress: string;
    tokenAddress: string;
    timeframe: string;
    currency: string;
    result: IMoEvmKlineItem[];
}
