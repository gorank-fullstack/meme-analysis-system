import { NumericString, Bool01, Status01 } from '@gr/interface-base';
export type Address = string;
export type DexLiquidityType = 'UniV2' | 'UniV3' | 'UniV4' | (string & {});
export interface IGpEvmDexInfo {
    liquidity_type: DexLiquidityType;
    name: string;
    liquidity: NumericString;
    pair: Address;
    pool_manager?: Address;
}
export interface IGpEvmHolderLockDetail {
    amount: NumericString;
    end_time: NumericString;
    opt_time: NumericString;
}
export interface IGpEvmHolderInfo {
    address: Address;
    tag: string;
    is_contract: Bool01;
    balance: NumericString;
    percent: NumericString;
    is_locked: Bool01;
    locked_detail?: IGpEvmHolderLockDetail[];
}
export interface IGpEvmLpNft {
    value: NumericString;
    NFT_id: string;
    amount: NumericString;
    in_effect: Status01;
    NFT_percentage: NumericString;
}
export interface IGpEvmLpHolderInfo {
    address: Address;
    tag: string;
    value: NumericString | null;
    is_contract: Bool01;
    balance: NumericString;
    percent: NumericString;
    NFT_list: IGpEvmLpNft[] | null;
    is_locked: Bool01;
}
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
    trust_list?: Status01;
}
export type IGpEvmTokenSecurityResult = Record<Address, IGpEvmTokenSecurityInfo>;
export interface IGpEvmTokenSecurityResponse {
    code: number;
    message: string;
    result: IGpEvmTokenSecurityResult;
}
