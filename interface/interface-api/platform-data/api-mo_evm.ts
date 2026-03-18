//------------------------------------ Mo Evm Token Pairs ------------------------------------
// https://docs.moralis.com/web3-data-api/evm/reference/get-token-pairs?token_address=0x6982508145454ce325ddbe47a25d4ec3d2311933&chain=eth

// 单个交易对中每个 token 的信息
export interface IMoEvmPair {
  token_address: string;
  token_name: string;
  token_symbol: string;
  token_logo: string | null;
  token_decimals: string; // 注意：数据中是 string 类型
  pair_token_type: 'token0' | 'token1';
  liquidity_usd: number;
}

// 主交易对信息
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
  pair: IMoEvmPair[]; // token0 和 token1 的信息
}

// 整个接口的响应结构
export interface IMoEvmTokenPairsResponse {
  page_size: number;
  page: number;
  pairs: IMoEvmTokenPair[];
}

//------------------------------------ Mo Evm Token Pair Stats ------------------------------------
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

//------------------------------------ Mo Evm Token Meta ------------------------------------
// https://docs.moralis.com/web3-data-api/evm/reference/get-token-metadata

// 链接信息
/* export interface IMoEvmTokenLinks {
  // moralis?: string;
  discord?: string;
  reddit?: string;
  telegram?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
  email?: string;//+
  moralis?: string;//+
} */
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
  email?: string;//+
  moralis?: string;//+
}

// 单个 Token 的结构定义
export interface IMoEvmTokenMeta {
  address: string;
  address_label: string | null;
  name: string;
  symbol: string;
  decimals: string; // 注意：是字符串
  // logo: string | null;
  logo: string;
  logo_hash: string | null;
  // thumbnail: string | null;
  thumbnail: string;
  total_supply: string;
  total_supply_formatted: string;
  fully_diluted_valuation: string;
  block_number: string;
  validated: number; // 1 表示已校验
  created_at: string; // ISO 日期格式
  possible_spam: boolean;
  verified_contract: boolean;
  categories: string[]; // 暂时为空数组，但类型为字符串数组
  links: IMoEvmTokenLinks;
  security_score: number | null;
  // description: string | null;
  description: string;
  circulating_supply: string;
  market_cap: string;

  // 自定义字段(gr_开头)，记录缓存时间
  gr_cache_t_sec:number;
}

// 整体响应是数组
export type IMoEvmTokenMetaList = IMoEvmTokenMeta[];

//------------------------------------ Mo Evm Token Holders ------------------------------------


export interface IMoEvmHolderItem {
  balance: string; // 原始 BigInt 字符串
  balance_formatted: string; // 格式化为人类可读的字符串（含小数）
  is_contract: boolean;
  owner_address: string;
  owner_address_label: string | null;
  entity: string | null;
  entity_logo: string | null;
  usd_value: string; // 原始 USD 金额字符串
  percentage_relative_to_total_supply: number;
}

export interface IMoEvmHolderResponse {
  cursor: string;
  page: number;
  page_size: number;
  result: IMoEvmHolderItem[];
}

//------------------------------------ Mo Evm Token Holder Insights ------------------------------------
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
  supply: string;         // 精度很高的字符串数字
  supplyPercent: number;  // 百分比，如 39
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

//------------------------------------ Mo Evm Token OHLCV ------------------------------------
export interface IMoEvmKlineItem {
  timestamp: string; // ISO 格式时间字符串，如 "2025-01-01T10:40:00.000Z"
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
  timeframe: string; // 如 "10min"
  currency: string;  // 如 "usd"
  result: IMoEvmKlineItem[];
}



