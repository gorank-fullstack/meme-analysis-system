
/* import { IGrTokenSortItem, 
  // TTabType ,
} from '@gr/interface/api/uniform-data'; */
import { IGrTokenSortItem_Client } from '../../interface-api/uniform-data';

// export type TTabKey = "trending_pools" | "new_pools";

export type TChainNameTabKey =
  "sol_trending_pools" | "eth_trending_pools" | "bsc_trending_pools" |
  "sol_new_pools" | "eth_new_pools" | "bsc_new_pools";


/* export type TChainTabDurationKey =
  "sol_trending_pools_1h" | "sol_trending_pools_6h" | "sol_new_pools" |
  "eth_trending_pools_1h" | "eth_trending_pools_6h" | "eth_new_pools" |
  "bsc_trending_pools_1h" | "bsc_trending_pools_6h" | "bsc_new_pools"; */
export type TChainNameTab_And_qtType_Key =
  "sol_trending_pools_5m" | "sol_trending_pools_1h" | "sol_trending_pools_6h" | "sol_trending_pools_24h" |
  "eth_trending_pools_5m" | "eth_trending_pools_1h" | "eth_trending_pools_6h" | "eth_trending_pools_24h" |
  "bsc_trending_pools_5m" | "bsc_trending_pools_1h" | "bsc_trending_pools_6h" | "bsc_trending_pools_24h";

// export type T_ChainTab_And_Duration_Key_old = TChainTabDurationKey | TChainTabKey;

export type T_ChainNameTab_And_qtType_Key_new =
  "sol_trending_pools_5m" | "sol_new_pools" |
  "eth_trending_pools_5m" | "eth_new_pools" |
  "bsc_trending_pools_5m" | "bsc_new_pools";

//可以 修改的
/* interface MutablePageFields {
  current_page_trending_1h: number;
  current_page_trending_6h: number;
  current_page_new: number;
} */

//不可以 修改的
/* interface ImmutablePageFields {
  readonly max_page_trending_1h: number;
  readonly max_page_trending_6h: number;
  readonly max_page_new: number;
} */
export interface IPageFields {
  current_page: number,
  max_page: number,
}


// export type TTaskPageInfo = MutablePageFields & ImmutablePageFields;

// type TGrTokenSortItems=IGrTokenSortItem[];
export const INIT_EMPTY_ARRAY_GR_SORT_ITEM: Record<T_ChainNameTab_And_qtType_Key_new, IGrTokenSortItem_Client[]> = {
  //sol
  // sol_trending_pools: [],
  sol_trending_pools_5m: [],
  /* sol_trending_pools_1h: [],
  sol_trending_pools_6h: [],
  sol_trending_pools_24h: [], */
  sol_new_pools: [],
  //eth
  // eth_trending_pools: [],
  eth_trending_pools_5m: [],
  /* eth_trending_pools_1h: [],
  eth_trending_pools_6h: [],
  eth_trending_pools_24h: [], */
  eth_new_pools: [],
  //bsc
  // bsc_trending_pools: [],
  bsc_trending_pools_5m: [],
  /* bsc_trending_pools_1h: [],
  bsc_trending_pools_6h: [],
  bsc_trending_pools_24h: [], */
  bsc_new_pools: [],  
}
