
import {
  isTQtType,
    // IGrTokenSortItem, 
    TTabType_Server,
} from '@gr/interface-base';

import {
    // CACHE_KEY_HEAD, 
    CACHE_KEY_MIDDLE,
} from 'src/constant/CACHE_KEY';

import {
    // T_ChainTab_And_Duration_Key,
    T_ChainNameTab_And_qtType_Key_new,
} from '@gr/interface-task/uniform-data';


// 特定：快速版--前中后，结构
export function getFullPath_4_Param_Fast_All_Slash(
  platformHead:string,
  firstPath:string,
  middlePath:string,
  lastPath:string){
  //格式类似：CACHE_GET_HEAD.MO+"/"+chainType+"/"+CACHE_KEY_MIDDLE+"/"+caArray
  return platformHead+"/"+firstPath+"/"+middlePath+"/"+lastPath;
}

/* export function getFullPath_4_Param_Fast_Last_Underline(
  platformHead:string,
  firstPath:string,
  middlePath:string,
  lastPath:string){
  //格式类似：CACHE_GET_HEAD.MO+"/"+chainType+"/"+CACHE_KEY_MIDDLE+"_"+caArray
  return platformHead+"/"+firstPath+"/"+middlePath+"_"+lastPath;
} */

export function getFullPath_3_Param_Fast(
  platformHead:string,
  firstPath:string,
  middlePath:string,
  // lastPath:string
){
  //格式类似：CACHE_GET_HEAD.MO+"/"+chainType+"/"+CACHE_KEY_MIDDLE+"/"+caArray
  return platformHead+"/"+firstPath+"/"+middlePath;
}

export function getChainNameTab_And_qtType_Key(
  chainType: string,
  tabType: TTabType_Server,
  qtType: string,
): T_ChainNameTab_And_qtType_Key_new {    
  //无duration情况１：当：tabType==="new_pools"时，不需要传入duration
  //无duration情况２：或当：tabType==="trending_pools"时，也可以不传入duration[合并多个时间段的结果]
  let chainTab_And_qtType_Key: T_ChainNameTab_And_qtType_Key_new=(chainType + "_" + tabType) as T_ChainNameTab_And_qtType_Key_new;
  
  //有duration情况：
  // if (tabType === CACHE_KEY_MIDDLE.TRENDING_POOLS &&(duration === "1h" || duration === "6h")) {
    if (tabType === CACHE_KEY_MIDDLE.TRENDING_POOLS && qtType === "5m") {
      chainTab_And_qtType_Key = (chainTab_And_qtType_Key + "_" + qtType) as T_ChainNameTab_And_qtType_Key_new;
  }
  /* if (tabType === CACHE_KEY_MIDDLE.TRENDING_POOLS) {
      if (duration === "1h" || duration === "6h") {
          chainTab_And_Duration_Key = (chainType + "_" + tabType + "_" + duration) as T_ChainTab_And_Duration_Key;
          // }else if(tabType === CACHE_KEY_MIDDLE.NEW_POOLS){
      } else if (duration === "") {
          //注意：TRENDING_POOLS时，也可以不传入：duration，即：duration===""
          chainTab_And_Duration_Key = (chainType + "_" + tabType) as T_ChainTab_And_Duration_Key;
      }
  } else {
      chainTab_And_Duration_Key = (chainType + "_" + tabType) as T_ChainTab_And_Duration_Key;
  } */


  /* if (tabType === CACHE_KEY_MIDDLE.TRENDING_POOLS &&
    (duration === "1h" || duration === "6h")) {
    chainTab_And_Duration_Key = (chainType + "_" + tabType + "_" + duration) as T_ChainTab_And_Duration_Key;
    // }else if(tabType === CACHE_KEY_MIDDLE.NEW_POOLS){
  } else {
    chainTab_And_Duration_Key = (chainType + "_" + tabType) as T_ChainTab_And_Duration_Key;
  } */
  return chainTab_And_qtType_Key;
}

export function getCacheFullPath_All_Slash(
  cacheKeyHead: string,
  chainType: string,
  tabType: TTabType_Server,
  duration: string,
): string {
  // let chainTab_And_Duration_Key: T_ChainTab_And_Duration_Key;
  let cacheFullPath: string = "";
  if (tabType === CACHE_KEY_MIDDLE.TRENDING_POOLS && isTQtType(duration)) {      
      cacheFullPath = getFullPath_4_Param_Fast_All_Slash(cacheKeyHead, chainType, tabType, duration);
      // }else if(tabType === CACHE_KEY_MIDDLE.NEW_POOLS){
  } else {
      cacheFullPath = getFullPath_3_Param_Fast(cacheKeyHead, chainType, tabType);
  }
  return cacheFullPath;
}

/* export function getCacheFullPath_Last_Underline(
  cacheKeyHead: string,
  chainType: string,
  tabType: TTabType,
  duration: string,
): string {
  let cacheFullPath: string = "";
  if (tabType === CACHE_KEY_MIDDLE.TRENDING_POOLS &&
      (duration === "1h" || duration === "6h")) {
      cacheFullPath = getFullPath_4_Param_Fast_Last_Underline(cacheKeyHead, chainType, tabType, duration);
      // }else if(tabType === CACHE_KEY_MIDDLE.NEW_POOLS){
  } else {
      cacheFullPath = getFullPath_3_Param_Fast(cacheKeyHead, chainType, tabType);
  }
  return cacheFullPath;
} */

/* 
 * 通用：快速版--编译路径模板
 * @param pathTemplate 模板路径，如 ":chainType/token_security/:caArray"
 * @returns 返回填充函数
 */
/* 
const compile = compilePath_Fast('/api/:version/user/:id');
const fullPath = compile({ version: 'v1', id: '123' }); 
// 结果: '/api/v1/user/123'
 */
export function compilePath_Fast(pathTemplate: string): (params: Record<string, string>) => string {
  const segments = pathTemplate.split('/');

  // 预处理每段路径，标记变量位
  const compiled = segments.map(segment => {
    if (segment.startsWith(':')) {
      const key = segment.slice(1);
      return (params: Record<string, string>) => {
        if (!(key in params)) {
          throw new Error(`Missing parameter for "${key}"`);
        }
        return params[key];
      };
    } else {
      return () => segment;
    }
  });

  // 返回高效的填充函数
  return (params: Record<string, string>) => {
    return compiled.map(fn => fn(params)).join('/');
  };
}


/**
 * 通用：慢速版--替换路径模板中的变量为对应值
 * @param pathFormat 模板路径，如 ":chainType/token_security/:caArray"
 * @param params 包含替换变量的对象，如 { chainType: "eth", caArray: "0x789652323" }
 * @returns 替换后的完整路径
 */
export function buildPathFromTemplate_Slow(
  pathFormat: string,
  params: Record<string, string>
): string {
  return pathFormat
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        const key = segment.slice(1);
        if (params[key] === undefined) {
          throw new Error(`Missing value for path variable: ${key}`);
        }
        return params[key];
      }
      return segment;
    })
    .join('/');
}

/*
// ✅ 使用示例：
const pathFormat = ":chainType/token_security/:caArray";
const chainType = "eth";
const caArray = "0x789652323";

const fullPath = buildPathFromTemplate(pathFormat, { chainType, caArray });
console.log(fullPath); // 输出：eth/token_security/0x789652323
 */