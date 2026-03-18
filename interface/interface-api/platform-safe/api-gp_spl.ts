// 新增：专用于 metadata_mutable
export interface IRawGpSplMetadataMutable {
  metadata_upgrade_authority: string[] | null;
  status: string | number | null;
}

// 原始 GoPlus 返回（宽松，字段必写，无 ?）
export interface IRawGpSplStatusAuthority {
  authority: string[] | null;
  status: string | number | null;
}

export interface IRawGpSplCreator {
  address: string;
  malicious_address: string | number;
}

export interface IRawGpSplDexStat {
  price_max: string;
  price_min: string;
  volume: string;
}

export interface IRawGpSplDexInfo {
  burn_percent: number;
  day: IRawGpSplDexStat;
  dex_name: string;
  fee_rate: string;
  id: string;
  lp_amount: string | null;
  month: IRawGpSplDexStat;
  open_time: string; // unix seconds
  price: string;
  tvl: string;
  type: string;
  week: IRawGpSplDexStat;
}

export interface IRawGpSplTokenMeta {
  description: string;
  name: string;
  symbol: string;
  uri: string;
}

export interface IRawGpSplBaseHolder {
  account: string;
  balance: string;
  is_locked: number; // 原始 JSON 数值类型
  locked_detail: Array<{
    amount: string;
    end_time: string;
    opt_time: string;
  }>;
  percent: string;
  tag: string;
  token_account: string;
}

export type IRawGpSplHolder = IRawGpSplBaseHolder;
export type IRawGpSplLpHolder = IRawGpSplBaseHolder;

export interface IRawGpSplTokenSecurityInfo {
  balance_mutable_authority: IRawGpSplStatusAuthority;
  closable: IRawGpSplStatusAuthority;

  creators: IRawGpSplCreator[];

  default_account_state: string | number | null;
  // default_account_state: string;
  default_account_state_upgradable: IRawGpSplStatusAuthority;

  freezable: IRawGpSplStatusAuthority;

  holder_count: string;
  holders: IRawGpSplHolder[];

  lp_holders: IRawGpSplLpHolder[];

  metadata: IRawGpSplTokenMeta;
  metadata_mutable: IRawGpSplMetadataMutable;

  mintable: IRawGpSplStatusAuthority;

  // non_transferable: string | number | null;
  non_transferable: string ;

  total_supply: string;

  transfer_fee: Record<string, unknown> | null | undefined;
  transfer_fee_upgradable: IRawGpSplStatusAuthority;

  // transfer_hook: unknown[] | null | undefined;
  transfer_hook: string[];
  transfer_hook_upgradable: IRawGpSplStatusAuthority;

  trusted_token: string | number | null;

  dex: IRawGpSplDexInfo[];

  // 自定义字段(gr_开头)，记录缓存时间
  gr_cache_t_sec:number;
}

export interface IRawGpSplTokenSecurityResponse {
  code: number;
  message: string;
  // result: Record<string, IRawGpSplTokenSecurityInfo | undefined>;
  result: Record<string, IRawGpSplTokenSecurityInfo>;
}
