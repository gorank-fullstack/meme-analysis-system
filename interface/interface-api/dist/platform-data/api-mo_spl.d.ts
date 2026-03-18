export interface IMoSplPair {
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    tokenLogo: string | null;
    tokenDecimals: string;
    pairTokenType: 'token0' | 'token1';
    liquidityUsd: number;
}
export interface IMoSplTokenPair {
    exchangeAddress: string;
    exchangeName: string;
    exchangeLogo: string | null;
    pairAddress: string;
    pairLabel: string;
    usdPrice: number;
    usdPrice24hrPercentChange: number;
    usdPrice24hrUsdChange: number;
    volume24hrNative: number;
    volume24hrUsd: number;
    liquidityUsd: number;
    baseToken: string;
    quoteToken: string;
    inactivePair: boolean;
    pair: IMoSplPair[];
}
export interface IMoSplTokenPairsResponse {
    pairs: IMoSplTokenPair[];
    pageSize: number;
    page: number;
    cursor: string | null;
}
export interface IMoSplMetaplexInfo {
    metadataUri: string;
    masterEdition: boolean;
    isMutable: boolean;
    sellerFeeBasisPoints: number;
    updateAuthority: string;
    primarySaleHappened: number;
}
export interface IMoSplTokenLinks {
    medium?: string;
    telegram?: string;
    twitter?: string;
    website?: string;
    github?: string;
    reddit?: string;
    moralis?: string;
}
export interface IMoSplTokenMeta {
    mint: string;
    standard: "metaplex" | string;
    name: string;
    symbol: string;
    logo: string;
    decimals: string;
    metaplex: IMoSplMetaplexInfo;
    fullyDilutedValue: string;
    totalSupply: string;
    totalSupplyFormatted: string;
    links: IMoSplTokenLinks;
    description: string;
    gr_cache_t_sec: number;
}
export interface IMoSplKlineDataItem {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    trades: number;
}
export interface IMoSplKlineApiResponse {
    cursor: string;
    page: number;
    pairAddress: string;
    tokenAddress: string;
    timeframe: string;
    currency: string;
    result: IMoSplKlineDataItem[];
}
export interface ISplPumpNewToken {
    tokenAddress: string;
    name: string;
    symbol: string;
    logo: string | null;
    decimals: string;
    priceNative: string;
    priceUsd: string;
    liquidity: string;
    fullyDilutedValuation: string;
    createdAt: string;
}
export interface ISplPumpNewTokenResponse {
    result: ISplPumpNewToken[];
}
export interface ISplPumpBondingToken {
    tokenAddress: string;
    name: string;
    symbol: string;
    logo: string | null;
    decimals: string;
    priceNative: string;
    priceUsd: string;
    liquidity: string;
    fullyDilutedValuation: string;
    bondingCurveProgress: number;
}
export interface ISplPumpBondingTokenResponse {
    result: ISplPumpBondingToken[];
}
export interface ISplPumpGraduatedToken {
    tokenAddress: string;
    name: string;
    symbol: string;
    logo: string;
    decimals: string;
    priceNative: string;
    priceUsd: string;
    liquidity: string;
    fullyDilutedValuation: string;
    graduatedAt: string;
}
export interface ISplPumpGraduatedTokenResponse {
    result: ISplPumpGraduatedToken[];
}
