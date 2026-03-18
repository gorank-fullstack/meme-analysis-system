import { TChainName } from '@gr/interface-base'
import { T_ChainNameTab_And_qtType_Key_new } from '@gr/interface-task/uniform-data'
//扩展出来的新类史：

export interface IDataClipFields {
    // max_records: number,
    MAX_RECORDS: number,
    KEEP_RECORDS: number,
}

export const DATA_CLIP: Record<TChainName, IDataClipFields> = {
    // spl
    sol: {
      MAX_RECORDS: 400_000,
      KEEP_RECORDS: 320_000,
    },
  
    // evm
    eth: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    bsc: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    base: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    aval: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    arb: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    linea: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    pulse: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    polygon: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    optimism: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    moonbeam: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    gnosis: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    ronin: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    fantom: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    cronos: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    lisk: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    chiliz: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    blast: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    sonic: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    hyper: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    sei: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    uni: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    "x-layer": { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
  
    // tvm
    tron: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
  
    // fvm
    flow: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
  
    // tao
    bittensor: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
  
    // move
    sui: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
    aptos: { MAX_RECORDS: 200_000, KEEP_RECORDS: 160_000 },
  };
  
// export const DATA_CLIP: Record<T_ChainTab_And_Duration_Key_new, IDataClipFields> = {
/*     export const DATA_CLIP: Record<TChainType, IDataClipFields> = {
    
    //sol
    sol_trending_pools: {//合并时间段后的
        max_records: 200,//最大返回的记录数
        records_limit: 500,//超过多少条记录数时，需要裁剪
        each_clip_records: 100,//当：记录数达到records_limit时，每次裁剪多少条记录    
    },
    sol_trending_pools_5m: {//未合并的时间段
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    sol_trending_pools_1h: {
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    sol_trending_pools_6h: {
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    sol_trending_pools_24h: {//未合并的时间段
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    sol_new_pools: {
        max_records: 200,
        records_limit: 5000,
        each_clip_records: 1000,
    },
    //eth
    eth_trending_pools: {
        max_records: 200,//最大返回的记录数
        records_limit: 500,//超过多少条记录数时，需要裁剪
        each_clip_records: 100,//当：记录数达到records_limit时，每次裁剪多少条记录    
    },
    eth_trending_pools_5m: {
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    eth_trending_pools_1h: {
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    eth_trending_pools_6h: {
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    eth_trending_pools_24h: {
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    eth_new_pools: {
        max_records: 200,
        records_limit: 1000,
        each_clip_records: 200,
    },

    //bsc
    bsc_trending_pools: {
        max_records: 200,//最大返回的记录数
        records_limit: 500,//超过多少条记录数时，需要裁剪
        each_clip_records: 100,//当：记录数达到records_limit时，每次裁剪多少条记录    
    },
    bsc_trending_pools_5m: {
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    bsc_trending_pools_1h: {
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    bsc_trending_pools_6h: {
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    bsc_trending_pools_24h: {
        max_records: 200,
        records_limit: 500,
        each_clip_records: 100,
    },
    bsc_new_pools: {
        max_records: 200,
        records_limit: 1000,
        each_clip_records: 200,
    },
}
 */