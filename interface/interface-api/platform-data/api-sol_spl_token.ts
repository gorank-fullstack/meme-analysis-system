//------------------------------------ Sol Spl token list ------------------------------------
// ISolSplTokenItem 在“Sol Spl token meta multi”中，定义
/* export interface ISolSplTokenItem {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
    created_time: number;
    price?: number; // 注意：并非所有 token 都有 price 字段
  } */

export interface ISolSplTokenListResponse {
  success: boolean;
  data: ISolSplTokenItem[];
  metadata: Record<string, any>; // metadata 暂时为空对象 {}
}

//------------------------------------ Sol Spl token top ------------------------------------
// ISolSplTokenItem 在“Sol Spl token meta multi”中，定义
/* export interface ISolSplTokenItem {
    address: string;//y
    decimals: number;
    created_time: number;//y
    name?: string;
    symbol?: string;
  } */

export interface ISolSplTokenTopListData {
  total: number;
  items: ISolSplTokenItem[];
}

export interface ISolSplTokenTopListResponse {
  success: boolean;
  data: ISolSplTokenTopListData;
  metadata: Record<string, any>; // 当前是 {}，也许将来有额外分页信息等
}

//------------------------------------ Sol Spl token trending ------------------------------------
// ISolSplTokenItem 在“Sol Spl token meta multi”中，定义
/* export interface ISolSplTokenItem {
    address: string;
    name: string;
    symbol: string;
    decimals?: number; // 有些 token 缺失此字段，设为可选
  } */

export interface ISolSplTokenTrendingResponse {
  success: boolean;
  data: ISolSplTokenItem[];
  metadata: Record<string, any>; // 当前为空对象，但保留拓展性
}
//------------------------------------ Sol Spl token price multi ------------------------------------

export interface ISolSplTokenDailyPrice {
  date: number;   // 格式类似 20250429，可进一步转为 YYYY-MM-DD
  price: number;
}

export interface ISolSplTokenPriceHistory {
  token_address: string;
  prices: ISolSplTokenDailyPrice[];
}

export interface ISolSplTokenPriceMultiResponse {
  success: boolean;
  data: ISolSplTokenPriceHistory[];
  metadata: Record<string, any>; // 如果 metadata 结构未知
}

//------------------------------------ Sol Spl token meta ------------------------------------
export interface ISolSplTokenMetaResponse {
  success: boolean;
  data: ISolSplTokenItem;
  metadata: Record<string, any>;
}
//------------------------------------ Sol Spl token meta multi ------------------------------------

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
  price?: number; // 注意：并非所有 token 都有 price 字段

  // 可选的额外市场字段（非所有 token 都有）
  volume_24h?: number;
  market_cap?: number;
  market_cap_rank?: number;
  price_change_24h?: number;

  // 自定义字段(gr_开头)，记录缓存时间
  gr_cache_t_sec: number;
}

export interface ISolSplTokenMetaMultiResponse {
  success: boolean;
  data: ISolSplTokenItem[];
  metadata: Record<string, any>; // 暂不清楚结构
}