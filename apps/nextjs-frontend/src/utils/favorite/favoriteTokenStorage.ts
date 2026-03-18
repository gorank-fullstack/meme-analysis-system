/**
 * favoriteStorage.ts
 * 
 * 功能说明：
 * 本模块用于管理 token 收藏信息在 localStorage 中的持久化。
 * 每个用户（非登录态）按链（sol、eth、bsc）最多收藏 1000 个 token。
 * 收藏信息结构如下：
 * {
 *   sol: { tokenAddress1: { group: '自定义分组1' }, ... },
 *   eth: { ... },
 *   bsc: { ... }
 * }
 * 
 * 提供以下函数：
 * - getFavoriteFromStorage(): 从 localStorage 中安全获取收藏信息
 * - saveFavoriteToStorage(data): 将收藏信息保存到 localStorage
 */

import { TFavoriteTokenState } from '@/store/favorite/favoriteTokenSlice';
import { FAVORITE_TOKEN_STORAGE_KEY } from '@/config/favorite_const';

// 空的收藏结构，用于初始化 fallback 情况
const EMPTY_FAVORITE_TOKEN: TFavoriteTokenState = {
  // SPL
  sol: {},

  // EVM
  eth: {},
  bsc: {},
  base: {},
  aval: {},
  arb: {},
  linea: {},
  pulse: {},
  polygon: {},
  optimism: {},
  moonbeam: {},
  gnosis: {},
  ronin: {},
  fantom: {},
  cronos: {},
  lisk: {},
  chiliz: {},
  blast: {},
  sonic: {},
  hyper: {},
  sei: {},
  uni: {},
  "x-layer": {},

  // TVM
  tron: {},

  // FVM
  flow: {},

  // TAO
  bittensor: {},

  // Move
  sui: {},
  aptos: {},
};


// 判断传入对象是否为合法的链收藏映射结构（对象结构为：tokenAddress -> { group: string }）
function isValidChainMap(
  obj: unknown
): obj is { [tokenAddress: string]: { groupIds: string[] } } {
  if (
    typeof obj !== "object" ||
    obj === null ||
    Array.isArray(obj) ||
    Object.getPrototypeOf(obj) !== Object.prototype
  ) {
    return false;
  }

  return Object.values(obj).every((v: unknown) => {
    if (
      typeof v !== "object" ||
      v === null ||
      Array.isArray(v) ||
      Object.getPrototypeOf(v) !== Object.prototype
    ) {
      return false;
    }

    // 这里 v 是 object，但类型未知
    const maybeGroupIds = (v as { [k: string]: unknown }).groupIds;

    return (
      Array.isArray(maybeGroupIds) &&
      maybeGroupIds.every((id: unknown): id is string => typeof id === "string")
    );
  });
}



/* function isValidChainMap_old(obj: unknown): obj is Record<string, { group: string }> {
  // return obj && typeof obj === 'object' && !Array.isArray(obj);
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj)
  );
} */

// 从 localStorage 获取收藏信息，如果解析失败或结构非法，则返回空结构
export function getFavoriteTokenFromStorage(): TFavoriteTokenState {
  // SSR 环境下直接返回空
  if (typeof window === "undefined") return EMPTY_FAVORITE_TOKEN;

  try {
    const raw = localStorage.getItem(FAVORITE_TOKEN_STORAGE_KEY);
    if (!raw) return EMPTY_FAVORITE_TOKEN;

    const parsed = JSON.parse(raw);

    // 校验每个链的数据结构是否为合法对象，防止用户手动篡改或存储被污染
    return {
      // SPL
      sol: isValidChainMap(parsed.sol) ? parsed.sol : {},

      // EVM
      eth: isValidChainMap(parsed.eth) ? parsed.eth : {},
      bsc: isValidChainMap(parsed.bsc) ? parsed.bsc : {},
      base: isValidChainMap(parsed.base) ? parsed.base : {},
      aval: isValidChainMap(parsed.aval) ? parsed.aval : {},
      arb: isValidChainMap(parsed.arb) ? parsed.arb : {},
      linea: isValidChainMap(parsed.linea) ? parsed.linea : {},
      pulse: isValidChainMap(parsed.pulse) ? parsed.pulse : {},
      polygon: isValidChainMap(parsed.polygon) ? parsed.polygon : {},
      optimism: isValidChainMap(parsed.optimism) ? parsed.optimism : {},
      moonbeam: isValidChainMap(parsed.moonbeam) ? parsed.moonbeam : {},
      gnosis: isValidChainMap(parsed.gnosis) ? parsed.gnosis : {},
      ronin: isValidChainMap(parsed.ronin) ? parsed.ronin : {},
      fantom: isValidChainMap(parsed.fantom) ? parsed.fantom : {},
      cronos: isValidChainMap(parsed.cronos) ? parsed.cronos : {},
      lisk: isValidChainMap(parsed.lisk) ? parsed.lisk : {},
      chiliz: isValidChainMap(parsed.chiliz) ? parsed.chiliz : {},
      blast: isValidChainMap(parsed.blast) ? parsed.blast : {},
      sonic: isValidChainMap(parsed.sonic) ? parsed.sonic : {},
      hyper: isValidChainMap(parsed.hyper) ? parsed.hyper : {},
      sei: isValidChainMap(parsed.sei) ? parsed.sei : {},
      uni: isValidChainMap(parsed.uni) ? parsed.uni : {},
      "x-layer": isValidChainMap(parsed["x-layer"]) ? parsed["x-layer"] : {},

      // TVM
      tron: isValidChainMap(parsed.tron) ? parsed.tron : {},

      // FVM
      flow: isValidChainMap(parsed.flow) ? parsed.flow : {},

      // TAO
      bittensor: isValidChainMap(parsed.bittensor) ? parsed.bittensor : {},

      // Move
      sui: isValidChainMap(parsed.sui) ? parsed.sui : {},
      aptos: isValidChainMap(parsed.aptos) ? parsed.aptos : {},
    };
  } catch (e) {
    console.error("解析 localStorage 收藏数据失败:", e);
    return EMPTY_FAVORITE_TOKEN;
  }
}

// 将收藏信息安全写入 localStorage
export function saveFavoriteTokenToStorage(data: TFavoriteTokenState) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(FAVORITE_TOKEN_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('保存收藏信息到 localStorage 失败:', e);
  }
}
