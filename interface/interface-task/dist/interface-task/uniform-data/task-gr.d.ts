import { IGrTokenSortItem_Client } from '../../interface-api/uniform-data';
export type TChainTabKey = "sol_trending_pools" | "eth_trending_pools" | "bsc_trending_pools" | "sol_new_pools" | "eth_new_pools" | "bsc_new_pools";
export type TChainTabDurationKey = "sol_trending_pools_5m" | "sol_trending_pools_1h" | "sol_trending_pools_6h" | "sol_trending_pools_24h" | "eth_trending_pools_5m" | "eth_trending_pools_1h" | "eth_trending_pools_6h" | "eth_trending_pools_24h" | "bsc_trending_pools_5m" | "bsc_trending_pools_1h" | "bsc_trending_pools_6h" | "bsc_trending_pools_24h";
export type T_ChainTab_And_Duration_Key_new = "sol_trending_pools_5m" | "sol_new_pools" | "eth_trending_pools_5m" | "eth_new_pools" | "bsc_trending_pools_5m" | "bsc_new_pools";
export interface IPageFields {
    current_page: number;
    max_page: number;
}
export declare const INIT_EMPTY_ARRAY_GR_SORT_ITEM: Record<T_ChainTab_And_Duration_Key_new, IGrTokenSortItem_Client[]>;
