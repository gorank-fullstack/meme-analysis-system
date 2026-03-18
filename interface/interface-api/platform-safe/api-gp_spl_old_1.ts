import { NumericString, Bool01, Status01 } from '@gr/interface-base';

// SPL 链特定
export type Pubkey = string;                     // Solana 地址/账户、公钥
export type UriString = string;                  // URI 地址
export type UnixTimeString = `${number}`;        // 秒级时间戳

// DEX 类型（SPL）
export type DexPoolType = 'Standard' | 'Concentrated' | (string & {});

// 顶层结构
export interface IGpSplTokenSecurityResponse {
    code: number;
    message: string;
    result: Record<Pubkey, IGpSplTokenSecurityInfo>;
  }
  
  // 通用：authority + status
  export interface IGpSplStatusAuthority {
    authority: Pubkey[];     // GoPlus 用地址数组
    status: Status01;        // '0' | '1'
  }
  
  // creator
  export interface IGpSplCreator {
    address: Pubkey;
    malicious_address: Bool01;
  }
  
  // 复用基类：普通持币 & LP 持币
  export interface IGpSplLockDetail {
    amount: NumericString;
    end_time: UnixTimeString;
    opt_time: UnixTimeString;
  }
  
  export interface IGpSplBaseHolder {
    account: Pubkey;               // 持有人钱包
    balance: NumericString;        // 余额（字符串）
    is_locked: Bool01;
    locked_detail: IGpSplLockDetail[];
    percent: NumericString;        // GoPlus 返回未*100 的占比；UI展示时再 *100 并加 %
    tag: string;
    token_account: Pubkey;         // SPL Token Account
  }
  
  export type IGpSplHolder = IGpSplBaseHolder;
  export type IGpSplLpHolder = IGpSplBaseHolder;
  
  // DEX 统计
  export interface IGpSplDexStat {
    price_max: NumericString;
    price_min: NumericString;
    volume: NumericString;
  }
  
  // DEX 信息
  export interface IGpSplDexInfo {
    burn_percent: number;            // GoPlus 给的是 number
    day: IGpSplDexStat;
    dex_name: string;
    fee_rate: NumericString;         // 费率常以字符串形式返回
    id: string;
    lp_amount: NumericString | null;
    month: IGpSplDexStat;
    open_time: UnixTimeString;
    price: NumericString;
    tvl: NumericString;
    type: DexPoolType;
    week: IGpSplDexStat;
  }
  
  // Metadata
  export interface IGpSplTokenMeta {
    description: string;
    name: string;
    symbol: string;
    uri: UriString;
  }
  
  // 核心：Token 安全详情
  export interface IGpSplTokenSecurityInfo {
    balance_mutable_authority: IGpSplStatusAuthority;
    closable: IGpSplStatusAuthority;
  
    creators: IGpSplCreator[];
  
    default_account_state: Status01 | string;  // 示例是 "1"，保守收紧到字面量优先
    default_account_state_upgradable: IGpSplStatusAuthority;
  
    freezable: IGpSplStatusAuthority;
  
    holder_count: NumericString;
    holders: IGpSplHolder[];
  
    lp_holders: IGpSplLpHolder[];
  
    metadata: IGpSplTokenMeta;
    metadata_mutable: IGpSplStatusAuthority;
  
    mintable: IGpSplStatusAuthority;
  
    non_transferable: Status01;                // 示例为 "0"
  
    total_supply: NumericString;
  
    // 官方结构可能扩展，这里先用 unknown，避免 any 失去类型保护
    transfer_fee: Record<string, unknown>;
    transfer_fee_upgradable: IGpSplStatusAuthority;
  
    transfer_hook: unknown[];                  // 暂未知
    transfer_hook_upgradable: IGpSplStatusAuthority;
  
    trusted_token: Bool01;
  
    // 可能缺失的字段建议都加上可选：?（等你见到更多样本后再收紧）
  }
  