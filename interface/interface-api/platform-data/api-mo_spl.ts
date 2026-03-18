//------------------------------------ Mo Spl Token Pairs ------------------------------------
// https://docs.moralis.com/web3-data-api/solana/reference/get-token-pairs-by-address?network=mainnet&address=SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt

// 单个 Token 的信息结构
export interface IMoSplPair {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string | null;
  tokenDecimals: string;
  pairTokenType: 'token0' | 'token1';
  liquidityUsd: number;
}

// 每一个交易对的结构
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

// 整个响应结构
export interface IMoSplTokenPairsResponse {
  pairs: IMoSplTokenPair[];
  pageSize: number;
  page: number;
  cursor: string | null;
}

//------------------------------------ Mo Spl Token Meta ------------------------------------
// https://docs.moralis.com/web3-data-api/solana/reference/get-token-metadata

// Metaplex 相关信息
export interface IMoSplMetaplexInfo {
  metadataUri: string;
  masterEdition: boolean;
  isMutable: boolean;
  sellerFeeBasisPoints: number;
  updateAuthority: string;
  primarySaleHappened: number;
}

// 各种链接信息
export interface IMoSplTokenLinks {
  medium?: string;
  telegram?: string;
  twitter?: string;
  website?: string;
  github?: string;
  reddit?: string;
  moralis?: string;
}

// 主体结构
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
  description: string ;

  // 自定义字段(gr_开头)，记录缓存时间
  gr_cache_t_sec:number;
}

//------------------------------------ Mo Spl Token OHLCV ------------------------------------
export interface IMoSplKlineDataItem {
  timestamp: string;         // ISO 时间字符串，例如 "2024-11-25T23:50:00.000Z"
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
  timeframe: string;         // 如 "10min"
  currency: string;          // 如 "usd"
  result: IMoSplKlineDataItem[];
}


//------------------------------------ Mo Spl Pump ------------------------------------
//---- Pump New ----
export interface ISplPumpNewToken {
  tokenAddress: string;
  name: string;
  symbol: string;
  logo: string | null;
  decimals: string; // 如果你希望后续参与运算，也可以改为 number
  priceNative: string;
  priceUsd: string;
  liquidity: string;
  fullyDilutedValuation: string;
  createdAt: string; // ISO 日期字符串，可在前端转为 Date 对象
};

export interface ISplPumpNewTokenResponse {
  result: ISplPumpNewToken[];
};

//---- Pump Bonding ----
export interface ISplPumpBondingToken {
  tokenAddress: string;
  name: string;
  symbol: string;
  logo: string | null;
  decimals: string; // 注意：虽然是数字，但原始数据是字符串
  priceNative: string;
  priceUsd: string;
  liquidity: string;
  fullyDilutedValuation: string;
  bondingCurveProgress: number;
}

export interface ISplPumpBondingTokenResponse {
  result: ISplPumpBondingToken[];
}

//---- Pump Graduated ----
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
  graduatedAt: string; // ISO 时间字符串
}

export interface ISplPumpGraduatedTokenResponse {
  result: ISplPumpGraduatedToken[];
}



