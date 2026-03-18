// src/utils/cache.util.ts

import { ExecutionContext } from '@nestjs/common';
// import { getExpTime } from './web3';

type ExpTimeMap = {
  [key: string]: number;
};

// 给访问类型：接口平台/链类型/数据类型，分别设置过期时间
const apiMoPathExpTimeMap: ExpTimeMap = {

  //------------------------------- Token --------------------------------------------------------------
  "api-mo/eth/token_pairs": 7200,
  "api-mo/bsc/token_pairs": 3600,
  "api-mo/sol/token_pairs": 1800,

  "api-mo/eth/pair_trans": 90,
  "api-mo/bsc/pair_trans": 60,
  "api-mo/sol/pair_trans": 40,

  "api-mo/eth/pair_snipers": 7200,
  "api-mo/bsc/pair_snipers": 3600,
  "api-mo/sol/pair_snipers": 2400,

  "api-mo/eth/token_meta": 7200 * 4,
  "api-mo/bsc/token_meta": 3600 * 4,
  "api-mo/sol/token_meta": 2400 * 4,

  "api-mo/eth/pair_stats": 7200 * 2,
  "api-mo/bsc/pair_stats": 3600 * 2,
  "api-mo/sol/pair_stats": 2400 * 2,

  "api-mo/eth/token_holders": 7200 * 3,
  "api-mo/bsc/token_holders": 3600 * 3,
  "api-mo/sol/token_holders": 1800 * 3,

  "api-mo/eth/token_holder_insights": 3600,
  "api-mo/bsc/token_holder_insights": 1800,
  "api-mo/sol/token_holder_insights": 900,

  //------------------------------- Price --------------------------------------------------------------
  "api-mo/eth/token_ohlcv": 3600,
  "api-mo/bsc/token_ohlcv": 1800,
  "api-mo/sol/token_ohlcv": 900,

  //------------------------------- Pump --------------------------------------------------------------
  // "api-mo/sol/pump_new": 10,
  // "api-mo/sol/pump_new": 100,
  "api-mo/sol/pump_new": 30,
  // "api-mo/sol/pump_bonding": 20,
  // "api-mo/sol/pump_bonding": 200,
  "api-mo/sol/pump_bonding": 60,
  // "api-mo/sol/pump_graduated": 30,
  // "api-mo/sol/pump_graduated": 300,
  "api-mo/sol/pump_graduated": 100,
}

const apiCgPathExpTimeMap: ExpTimeMap = {
  //------------------------------- Pools --------------------------------------------------------------
  "api-cg/eth/trending_pools": 300,
  "api-cg/bsc/trending_pools": 120,
  "api-cg/sol/trending_pools": 60,

  "api-cg/eth/new_pools": 300,
  "api-cg/bsc/new_pools": 120,
  "api-cg/sol/new_pools": 60,

  "api-cg/eth/pools": 240,
  "api-cg/bsc/pools": 180,
  "api-cg/sol/pools": 120,

  "api-cg/eth/pools_multi": 480,
  "api-cg/bsc/pools_multi": 360,
  "api-cg/sol/pools_multi": 240,

  //------------------------------- Tokens --------------------------------------------------------------
  "api-cg/eth/token_meta": 960,
  "api-cg/bsc/token_meta": 720,
  "api-cg/sol/token_meta": 480,

  "api-cg/eth/token_meta_multi": 1200,
  "api-cg/bsc/token_meta_multi": 900,
  "api-cg/sol/token_meta_multi": 600,
}
const apiSolPathExpTimeMap: ExpTimeMap = {

  //------------------------------- Token --------------------------------------------------------------
  "api-sol/sol/token_trans": 300,
  "api-sol/sol/token_defi_activity": 1200,
  "api-sol/sol/token_markets": 800,
  "api-sol/sol/token_meta": 600,
  "api-sol/sol/token_meta_multi": 300,
  "api-sol/sol/token_price": 600,
  "api-sol/sol/token_price_multi": 300,

  "api-sol/sol/token_holders": 60,
  // "api-sol/sol/token_list": 20,
  "api-sol/sol/token_list": 600,
  "api-sol/sol/token_top": 200,
  "api-sol/sol/token_trending": 300,

  //------------------------------- Account (Aa) --------------------------------------------------------------
  "api-sol/sol/account_trans_desc": 600,
  "api-sol/sol/account_trans_asc": 800,
  "api-sol/sol/account_defi_activity": 1000,
  "api-sol/sol/account_balance_change_activity": 500,
  "api-sol/sol/account_portfolio": 400,
  "api-sol/sol/account_token_accounts": 300,
  "api-sol/sol/account_trans_export": 500,
  "api-sol/sol/account_meta": 1200,

  //------------------------------- Pool (也叫：Market) --------------------------------------------------------------
  "api-sol/sol/pool_list": 1200,
  "api-sol/sol/pool_info": 800,
  "api-sol/sol/pool_vol": 1600,
}

const apiGrPathExpTimeMap: ExpTimeMap = {
  //------------------------------- Pools --------------------------------------------------------------
  "api-gr/eth/trending_pools": 600,
  "api-gr/bsc/trending_pools": 240,
  "api-gr/sol/trending_pools": 120,

  "api-gr/eth/new_pools": 300,
  "api-gr/bsc/new_pools": 120,
  "api-gr/sol/new_pools": 60,
  //------------------------------- Token --------------------------------------------------------------

}

// task-gr读取的缓存是：由Task的定期访问api，然后缓存到redis(永不过期)。
const taskGrPathExpTimeMap: ExpTimeMap = {
  //------------------------------- Pools --------------------------------------------------------------
  // "task-gr/eth/trending_pools": 45,
  "task-gr/eth/trending_pools_5m": 40,
  "task-gr/eth/trending_pools_1h": 40,
  "task-gr/eth/trending_pools_6h": 60,
  "task-gr/eth/trending_pools_24h": 60,  
  "task-gr/eth/new_pools_5m": 40,
  "task-gr/eth/new_pools_1h": 40,
  "task-gr/eth/new_pools_6h": 60,
  "task-gr/eth/new_pools_24h": 60,  
  // "task-gr/eth/new_pools": 20,

  // "task-gr/bsc/trending_pools": 45,
  "task-gr/bsc/trending_pools_5m": 40,
  "task-gr/bsc/trending_pools_1h": 40,
  "task-gr/bsc/trending_pools_6h": 60,
  "task-gr/bsc/trending_pools_24h": 60,
  "task-gr/bsc/new_pools_5m": 40,
  "task-gr/bsc/new_pools_1h": 40,
  "task-gr/bsc/new_pools_6h": 60,
  "task-gr/bsc/new_pools_24h": 60,
  // "task-gr/bsc/new_pools": 20,

  // "task-gr/sol/trending_pools": 40,
  "task-gr/sol/trending_pools_5m": 40,
  "task-gr/sol/trending_pools_1h": 40,
  "task-gr/sol/trending_pools_6h": 60,
  "task-gr/sol/trending_pools_24h": 60,
  "task-gr/sol/new_pools_5m": 40,
  "task-gr/sol/new_pools_1h": 40,
  "task-gr/sol/new_pools_6h": 60,
  "task-gr/sol/new_pools_24h": 60,
  // "task-gr/sol/new_pools": 20,

  //------------------------------- Token --------------------------------------------------------------

}
// 根据 t（上线时间与当前时间的秒数差）来返回合适的: TokenMeta缓存 TTL
// export function getSolTokenMetaTtl(t: number): number {
export function getTokenMetaTtl(t: number): number {
  // 原始
  /* if (t > 86400 * 90) {
    return 86400 * 3;//上线超过90天，缓存3天
  } else if (t > 86400 * 30) {
    return 86400;//上线超过30天，缓存1天
  } else if (t > 86400 * 10) {
    return 43200;//上线超过10天，缓存12小时
  } else if (t > 86400 * 3) {
    return 21600;//上线超过3天，缓存6小时
  } else if (t > 86400 * 1) {
    return 10800;//上线超过1天，缓存3小时
  } else if (t > 21600) {
    return 7200;//上线超过6小时，缓存2小时
  } else if (t > 7200) {
    return 1800;//上线超过2小时，缓存30分钟
  }else if (t > 1800) {
    return 600;//上线超过30分钟，缓存10分钟
  }else if (t > 600) {
    return 180;//上线超过10分钟，缓存3分钟
  } */

  //  优化后
  const rules: [number, number][] = [
    [86400 * 90, 86400 * 3],  // > 90天 => 缓存3天
    [86400 * 30, 86400],      // > 30天 => 缓存1天
    [86400 * 10, 43200],      // > 10天 => 缓存12小时
    [86400 * 3, 21600],       // > 3天 => 缓存6小时
    [86400 * 1, 10800],       // > 1天 => 缓存3小时
    [21600, 7200],            // > 6小时 => 缓存2小时
    [7200, 1800],             // > 2小时 => 缓存30分钟
    [1800, 600],              // > 30分钟 => 缓存10分钟
    [600, 180],               // > 10分钟 => 缓存3分钟
  ];

  console.log('t=', t);
  for (const [threshold, ttl] of rules) {
    if (t > threshold) return ttl;
  }

  //默认缓存30分钟
  return 1800;
}

// 根据 t（上线时间与当前时间的秒数差）来返回合适的: TokenSecurity缓存 TTL
export function getTokenSecurityTtl(t: number): number {

  
  const rules: [number, number][] = [
    [86400 * 90, 86400 * 3],  // > 90天 => 缓存3天
    [86400 * 30, 86400],      // > 30天 => 缓存1天
    [86400 * 10, 43200],      // > 10天 => 缓存12小时
    [86400 * 3, 21600],       // > 3天 => 缓存6小时
    [86400 * 1, 10800],       // > 1天 => 缓存3小时
    [21600, 7200],            // > 6小时 => 缓存2小时
    // [7200, 1800],             // > 2小时 => 缓存30分钟
    [3600, 3600],              // > 1小时 => 缓存60分钟
    [1800, 1800],              // > 30分钟 => 缓存30分钟
    [600, 600],               // > 10分钟 => 缓存10分钟
    [300, 300],               // > 5分钟 => 缓存5分钟
  ];

  console.log('t=', t);
  for (const [threshold, ttl] of rules) {
    if (t > threshold) return ttl;
  }

  //默认缓存30分钟
  return 1800;
}
//在getApiExpTimeFunc函数里，原先使用switch语句，的优化方案．使用Map类型
const apiPathMap: Record<string, ExpTimeMap> = {
  api_mo: apiMoPathExpTimeMap,
  api_sol: apiSolPathExpTimeMap,
  api_cg: apiCgPathExpTimeMap,
  api_gr: apiGrPathExpTimeMap,
  api_gp:{},
  task_gr:taskGrPathExpTimeMap,
  
};

type TApiModule = "api_mo" | "api_sol" | "api_cg" | "api_gp" | "api_gr" | "task_gr";
// const VALID_API_MODULES: TApiModule[] = ["mo", "sol", "cg", "gr"];
const getApiExpTime = (apiModule: TApiModule, accessPath: string): number => {
  return apiPathMap[apiModule]?.[accessPath] ?? 30;
};

/**
 * 根据请求路径、方法等动态设置缓存过期时间（TTL）
 * @param ctx - 当前请求的执行上下文
 * @returns {number} - 动态缓存过期时间（秒）
 */
export function getApiTTL(ctx: ExecutionContext): number {
  const req = ctx.switchToHttp().getRequest();
  const method = req.method;
  // const path = req.route.path; // 获取路径模板（例如：'/users/:id'）
  const path = req.url; // 获取访问路径

  // 将路径按 `/` 拆分成数组
  const pathSegments: string[] = path.split('/').filter(Boolean); // 使用 filter(Boolean) 去除空字符串

  // 因为：访问路径是"api-mo"，但对象变量名，不支持“-”符号，只能在定义时用"_"代替
  // replace("-", "_") 默认只替换第一个匹配。  
  const apiModuleName: TApiModule = pathSegments[0].replace("-", "_") as TApiModule;
  // console.log('apiModule=', apiModuleName);
  //先校验值是否合法的模块请求．
  // 检验可以省略．因为NestJs的路由机制，能进入到这里，肯定是合法的
  /*
    const rawModule = pathSegments[0];
    if (!VALID_API_MODULES.includes(rawModule as TApiModule)) {
    throw new Error(`Invalid apiModule: ${rawModule}`);
  } */

  // 返回前三个路径段拼接成的路径
  const pathTop3 = pathSegments.slice(0, 3).join('/');

  console.log('pathTop3=', pathTop3);
  // 根据路径和方法设置不同的 TTL
  if (method === 'GET') {
    // const expTime = getApiMoExpTimeFunc(pathTop3);
    const expTime = getApiExpTime(apiModuleName, pathTop3);
    console.log('Api-Mo Hit failed，Find TTL(单位：秒)：', expTime);
    // return getApiMoExpTimeFunc(pathTop3);
    return expTime;
  }

  return 30; // 默认缓存 30 秒
}
