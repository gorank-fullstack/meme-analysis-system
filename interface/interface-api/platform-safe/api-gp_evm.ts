// DEX 交易对信息（Raw）
export interface IRawGpEvmDexInfo {
  liquidity_type: string;
  name: string;
  liquidity: string;
  pair: string;
  pool_manager?: string;
}

// 普通持币人（Raw）
export interface IRawGpEvmHolderInfo {
  address: string;
  tag: string;
  is_contract: number;
  balance: string;
  percent: string;
  is_locked: number;
}

// LP 持币人 NFT 明细（Raw）
export interface IRawGpEvmLpNft {
  value: string;
  NFT_id: string;
  amount: string;
  in_effect: string;
  NFT_percentage: string;
}

// LP 持币人（Raw）
export interface IRawGpEvmLpHolderInfo {
  address: string;
  tag: string;
  value: string | null;
  is_contract: number;
  balance: string;
  percent: string;
  NFT_list: IRawGpEvmLpNft[] | null;
  is_locked: number;
}

// Token 安全详情（Raw，EVM）
export interface IRawGpEvmTokenSecurityInfo {
  anti_whale_modifiable: string;
  buy_tax: string;
  can_take_back_ownership: string;
  cannot_buy: string;
  cannot_sell_all: string;

  creator_address: string;
  creator_balance: string;
  creator_percent: string;

  dex: IRawGpEvmDexInfo[];

  external_call: string;
  hidden_owner: string;

  holder_count: string;
  holders: IRawGpEvmHolderInfo[];

  honeypot_with_same_creator: string;
  is_anti_whale: string;
  is_blacklisted: string;
  is_honeypot: string;
  is_in_dex: string;
  is_mintable: string;
  is_open_source: string;
  is_proxy: string;
  is_whitelisted: string;

  lp_holder_count: string;
  lp_holders: IRawGpEvmLpHolderInfo[];

  lp_total_supply: string;

  owner_address: string;
  owner_balance: string;
  owner_change_balance: string;
  owner_percent: string;

  personal_slippage_modifiable: string;
  selfdestruct: string;
  sell_tax: string;
  slippage_modifiable: string;

  token_name: string;
  token_symbol: string;
  total_supply: string;

  trading_cooldown: string;
  transfer_pausable: string;
  transfer_tax: string;

  trust_list?: string;

  // 自定义字段(gr_开头)，记录缓存时间
  gr_cache_t_sec:number;
}

// 顶层 result：地址 -> 原始安全详情（Raw）
export type IRawGpEvmTokenSecurityResult = Record<string, IRawGpEvmTokenSecurityInfo>;

// 顶层响应（Raw）
export interface IRawGpEvmTokenSecurityResponse {
  code: number;
  message: string;
  result: IRawGpEvmTokenSecurityResult;
}
