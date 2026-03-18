import { NumericString, Bool01, Status01 } from '@gr/interface-base';

// EVM 链特定
export type Address = string; // EVM 地址

// DEX 类型（EVM）
export type DexLiquidityType = 'UniV2' | 'UniV3' | 'UniV4' | (string & {});

// DEX 交易对信息
export interface IGpEvmDexInfo {
  liquidity_type: DexLiquidityType;
  name: string;
  liquidity: NumericString;
  pair: Address;
  pool_manager?: Address; // 仅 UniV4 才有
}

// 普通持币人的锁仓详情
export interface IGpEvmHolderLockDetail {
  amount: NumericString;
  end_time: NumericString; // 时间戳（秒）
  opt_time: NumericString; // 操作时间（秒）
}

// 普通持币人
export interface IGpEvmHolderInfo {
  address: Address;
  tag: string;
  is_contract: Bool01;           // 0/1 表示是否合约地址
  balance: NumericString;
  percent: NumericString;        // 占比（原值，需 *100% 才是百分比）
  is_locked: Bool01;
  locked_detail?: IGpEvmHolderLockDetail[];
}

// LP 持币人 NFT 明细
export interface IGpEvmLpNft {
  value: NumericString;
  NFT_id: string;
  amount: NumericString;
  in_effect: Status01;           // '0'/'1'
  NFT_percentage: NumericString; // 占 LP 的比例
}

// LP 持币人
export interface IGpEvmLpHolderInfo {
  address: Address;
  tag: string;
  value: NumericString | null;   // LP Token 对应的价值
  is_contract: Bool01;
  balance: NumericString;        // LP Token 数量
  percent: NumericString;        // 占比
  NFT_list: IGpEvmLpNft[] | null;
  is_locked: Bool01;
}

// Token 安全性详情（EVM 链）
export interface IGpEvmTokenSecurityInfo {
  anti_whale_modifiable: Status01;
  buy_tax: NumericString;
  can_take_back_ownership: Status01;
  cannot_buy: Status01;
  cannot_sell_all: Status01;

  creator_address: Address;
  creator_balance: NumericString;
  creator_percent: NumericString;

  dex: IGpEvmDexInfo[];

  external_call: Status01;
  hidden_owner: Status01;

  holder_count: NumericString;
  holders: IGpEvmHolderInfo[];

  honeypot_with_same_creator: Status01;
  is_anti_whale: Status01;
  is_blacklisted: Status01;
  is_honeypot: Status01;
  is_in_dex: Status01;
  is_mintable: Status01;
  is_open_source: Status01;
  is_proxy: Status01;
  is_whitelisted: Status01;

  lp_holder_count: NumericString;
  lp_holders: IGpEvmLpHolderInfo[];

  lp_total_supply: NumericString;

  owner_address: Address;
  owner_balance: NumericString;
  owner_change_balance: NumericString;
  owner_percent: NumericString;

  personal_slippage_modifiable: Status01;
  selfdestruct: Status01;
  sell_tax: NumericString;
  slippage_modifiable: Status01;

  token_name: string;
  token_symbol: string;
  total_supply: NumericString;

  trading_cooldown: Status01;
  transfer_pausable: Status01;
  transfer_tax: NumericString;

  trust_list?: Status01; // JSON 里多了一个 trust_list，但定义里没写
}

// 顶层结构
export type IGpEvmTokenSecurityResult = Record<Address, IGpEvmTokenSecurityInfo>;

export interface IGpEvmTokenSecurityResponse {
  code: number;
  message: string;
  result: IGpEvmTokenSecurityResult;
}
