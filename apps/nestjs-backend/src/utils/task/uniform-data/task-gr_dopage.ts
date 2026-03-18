import { 
  API_PAGE_TRENDING_POOLS_5m, 
  // API_PAGE_TRENDING_POOLS_1h, 
  // API_PAGE_TRENDING_POOLS_6h, 
  API_PAGE_NEW_POOLS 
} from 'src/constant/API_PAGE';
import {T_ChainNameTab_And_qtType_Key_new,IPageFields} from '@gr/interface-task/uniform-data';

export const TASK_PAGE_MAP_V2: Record<T_ChainNameTab_And_qtType_Key_new, IPageFields> = {
    //sol
    /* sol_trending_pools: {
      current_page: API_PAGE_TRENDING_POOLS_1h.CG_SPL_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_1h.CG_SPL_MAX_PAGE,
    }, */
    sol_trending_pools_5m: {
      current_page: API_PAGE_TRENDING_POOLS_5m.CG_SPL_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_5m.CG_SPL_MAX_PAGE,
    },
    /* sol_trending_pools_1h: {
      current_page: API_PAGE_TRENDING_POOLS_1h.CG_SPL_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_1h.CG_SPL_MAX_PAGE,
    },
    sol_trending_pools_6h: {
      current_page: API_PAGE_TRENDING_POOLS_6h.CG_SPL_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_6h.CG_SPL_MAX_PAGE,
    },
    sol_trending_pools_24h: {
      current_page: API_PAGE_TRENDING_POOLS_6h.CG_SPL_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_6h.CG_SPL_MAX_PAGE,
    }, */
    sol_new_pools: {
      current_page: API_PAGE_NEW_POOLS.CG_SPL_START_PAGE,
      max_page: API_PAGE_NEW_POOLS.CG_SPL_MAX_PAGE,
    },

    //eth
    /* eth_trending_pools: {
      current_page: API_PAGE_TRENDING_POOLS_1h.CG_EVM_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_1h.CG_EVM_MAX_PAGE,
    }, */
    eth_trending_pools_5m: {
      current_page: API_PAGE_TRENDING_POOLS_5m.CG_EVM_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_5m.CG_EVM_MAX_PAGE,
    },
    /* eth_trending_pools_1h: {
      current_page: API_PAGE_TRENDING_POOLS_1h.CG_EVM_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_1h.CG_EVM_MAX_PAGE,
    },
    eth_trending_pools_6h: {
      current_page: API_PAGE_TRENDING_POOLS_6h.CG_EVM_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_6h.CG_EVM_MAX_PAGE,
    },
    eth_trending_pools_24h: {
      current_page: API_PAGE_TRENDING_POOLS_6h.CG_EVM_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_6h.CG_EVM_MAX_PAGE,
    }, */
    eth_new_pools: {
      current_page: API_PAGE_NEW_POOLS.CG_EVM_START_PAGE,
      max_page: API_PAGE_NEW_POOLS.CG_EVM_MAX_PAGE,
    },
    //bsc
    /* bsc_trending_pools: {
      current_page: API_PAGE_TRENDING_POOLS_1h.CG_EVM_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_1h.CG_EVM_MAX_PAGE,
    }, */
    bsc_trending_pools_5m: {
      current_page: API_PAGE_TRENDING_POOLS_5m.CG_EVM_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_5m.CG_EVM_MAX_PAGE,
    },
    /* bsc_trending_pools_1h: {
      current_page: API_PAGE_TRENDING_POOLS_1h.CG_EVM_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_1h.CG_EVM_MAX_PAGE,
    },
    bsc_trending_pools_6h: {
      current_page: API_PAGE_TRENDING_POOLS_6h.CG_EVM_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_6h.CG_EVM_MAX_PAGE,
    },
    bsc_trending_pools_24h: {
      current_page: API_PAGE_TRENDING_POOLS_6h.CG_EVM_START_PAGE,
      max_page: API_PAGE_TRENDING_POOLS_6h.CG_EVM_MAX_PAGE,
    }, */
    bsc_new_pools: {
      current_page: API_PAGE_NEW_POOLS.CG_EVM_START_PAGE,
      max_page: API_PAGE_NEW_POOLS.CG_EVM_MAX_PAGE,
    },
  }
  
  
  