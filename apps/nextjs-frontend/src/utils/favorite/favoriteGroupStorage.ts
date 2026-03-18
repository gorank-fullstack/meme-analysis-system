/**
 * favoriteGroupStorage.ts
 * 
 * 功能说明：
 * 本模块用于管理收藏分组信息在 localStorage 中的持久化。
 * 每个用户（非登录态）按链（sol、eth、bsc）维护分组列表和 nextGroupId。
 * 分组信息结构如下：
 * {
 *   sol: {
 *     nextGroupId: 1721550000,
 *     groups: [
 *       { group_id: '1721550000', name: '我的分组', index: 0, tokenAddresses: [...] },
 *       ...
 *     ]
 *   },
 *   eth: { ... },
 *   bsc: { ... }
 * }
 * 
 * 提供以下函数：
 * - getFavoriteGroupFromStorage(): 从 localStorage 安全读取分组信息
 * - saveFavoriteGroupToStorage(data): 将分组信息保存到 localStorage
 */

import { TFavoriteGroupState, IFavoriteGroupItem } from '@/store/favorite/favoriteGroupSlice';
import { FAVORITE_GROUP_STORAGE_KEY } from '@/config/favorite_const';

const getEmptyFavoriteGroupState = (): TFavoriteGroupState => {
  const getInitialNextGroupId = () => Math.floor(Date.now() / 1000);

  return {
    // SPL
    sol: { nextGroupId: getInitialNextGroupId(), groups: [] },

    // EVM
    eth: { nextGroupId: getInitialNextGroupId(), groups: [] },
    bsc: { nextGroupId: getInitialNextGroupId(), groups: [] },
    base: { nextGroupId: getInitialNextGroupId(), groups: [] },
    aval: { nextGroupId: getInitialNextGroupId(), groups: [] },
    arb: { nextGroupId: getInitialNextGroupId(), groups: [] },
    linea: { nextGroupId: getInitialNextGroupId(), groups: [] },
    pulse: { nextGroupId: getInitialNextGroupId(), groups: [] },
    polygon: { nextGroupId: getInitialNextGroupId(), groups: [] },
    optimism: { nextGroupId: getInitialNextGroupId(), groups: [] },
    moonbeam: { nextGroupId: getInitialNextGroupId(), groups: [] },
    gnosis: { nextGroupId: getInitialNextGroupId(), groups: [] },
    ronin: { nextGroupId: getInitialNextGroupId(), groups: [] },
    fantom: { nextGroupId: getInitialNextGroupId(), groups: [] },
    cronos: { nextGroupId: getInitialNextGroupId(), groups: [] },
    lisk: { nextGroupId: getInitialNextGroupId(), groups: [] },
    chiliz: { nextGroupId: getInitialNextGroupId(), groups: [] },
    blast: { nextGroupId: getInitialNextGroupId(), groups: [] },
    sonic: { nextGroupId: getInitialNextGroupId(), groups: [] },
    hyper: { nextGroupId: getInitialNextGroupId(), groups: [] },
    sei: { nextGroupId: getInitialNextGroupId(), groups: [] },
    uni: { nextGroupId: getInitialNextGroupId(), groups: [] },
    "x-layer": { nextGroupId: getInitialNextGroupId(), groups: [] },

    // TVM
    tron: { nextGroupId: getInitialNextGroupId(), groups: [] },

    // FVM
    flow: { nextGroupId: getInitialNextGroupId(), groups: [] },

    // TAO
    bittensor: { nextGroupId: getInitialNextGroupId(), groups: [] },

    // Move
    sui: { nextGroupId: getInitialNextGroupId(), groups: [] },
    aptos: { nextGroupId: getInitialNextGroupId(), groups: [] },
  };
};


// 判断某个对象是否是合法的分组
function isValidGroup(obj: IFavoriteGroupItem): obj is IFavoriteGroupItem {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.group_id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.index === 'number' &&
    Array.isArray(obj.tokenAddresses)
  );
}

// 判断链的数据是否合法
function isValidChainGroup(obj: unknown): obj is { nextGroupId: number; groups: IFavoriteGroupItem[] } {
  if (typeof obj === 'object' && obj !== null) {
    const maybeObj = obj as { nextGroupId?: unknown; groups?: unknown };

    return (
      typeof maybeObj.nextGroupId === 'number' &&
      Array.isArray(maybeObj.groups) &&
      maybeObj.groups.every(isValidGroup)
    );
  }

  return false;
}

// 从 localStorage 获取收藏分组信息
export function getFavoriteGroupFromStorage(): TFavoriteGroupState {
  if (typeof window === "undefined") return getEmptyFavoriteGroupState();

  try {
    const raw = localStorage.getItem(FAVORITE_GROUP_STORAGE_KEY);
    if (!raw) return getEmptyFavoriteGroupState();

    const parsed = JSON.parse(raw);

    return {
      // SPL
      sol: isValidChainGroup(parsed.sol) ? parsed.sol : { nextGroupId: 1, groups: [] },

      // EVM
      eth: isValidChainGroup(parsed.eth) ? parsed.eth : { nextGroupId: 1, groups: [] },
      bsc: isValidChainGroup(parsed.bsc) ? parsed.bsc : { nextGroupId: 1, groups: [] },
      base: isValidChainGroup(parsed.base) ? parsed.base : { nextGroupId: 1, groups: [] },
      aval: isValidChainGroup(parsed.aval) ? parsed.aval : { nextGroupId: 1, groups: [] },
      arb: isValidChainGroup(parsed.arb) ? parsed.arb : { nextGroupId: 1, groups: [] },
      linea: isValidChainGroup(parsed.linea) ? parsed.linea : { nextGroupId: 1, groups: [] },
      pulse: isValidChainGroup(parsed.pulse) ? parsed.pulse : { nextGroupId: 1, groups: [] },
      polygon: isValidChainGroup(parsed.polygon) ? parsed.polygon : { nextGroupId: 1, groups: [] },
      optimism: isValidChainGroup(parsed.optimism) ? parsed.optimism : { nextGroupId: 1, groups: [] },
      moonbeam: isValidChainGroup(parsed.moonbeam) ? parsed.moonbeam : { nextGroupId: 1, groups: [] },
      gnosis: isValidChainGroup(parsed.gnosis) ? parsed.gnosis : { nextGroupId: 1, groups: [] },
      ronin: isValidChainGroup(parsed.ronin) ? parsed.ronin : { nextGroupId: 1, groups: [] },
      fantom: isValidChainGroup(parsed.fantom) ? parsed.fantom : { nextGroupId: 1, groups: [] },
      cronos: isValidChainGroup(parsed.cronos) ? parsed.cronos : { nextGroupId: 1, groups: [] },
      lisk: isValidChainGroup(parsed.lisk) ? parsed.lisk : { nextGroupId: 1, groups: [] },
      chiliz: isValidChainGroup(parsed.chiliz) ? parsed.chiliz : { nextGroupId: 1, groups: [] },
      blast: isValidChainGroup(parsed.blast) ? parsed.blast : { nextGroupId: 1, groups: [] },
      sonic: isValidChainGroup(parsed.sonic) ? parsed.sonic : { nextGroupId: 1, groups: [] },
      hyper: isValidChainGroup(parsed.hyper) ? parsed.hyper : { nextGroupId: 1, groups: [] },
      sei: isValidChainGroup(parsed.sei) ? parsed.sei : { nextGroupId: 1, groups: [] },
      uni: isValidChainGroup(parsed.uni) ? parsed.uni : { nextGroupId: 1, groups: [] },
      "x-layer": isValidChainGroup(parsed["x-layer"]) ? parsed["x-layer"] : { nextGroupId: 1, groups: [] },

      // TVM
      tron: isValidChainGroup(parsed.tron) ? parsed.tron : { nextGroupId: 1, groups: [] },

      // FVM
      flow: isValidChainGroup(parsed.flow) ? parsed.flow : { nextGroupId: 1, groups: [] },

      // TAO
      bittensor: isValidChainGroup(parsed.bittensor) ? parsed.bittensor : { nextGroupId: 1, groups: [] },

      // Move
      sui: isValidChainGroup(parsed.sui) ? parsed.sui : { nextGroupId: 1, groups: [] },
      aptos: isValidChainGroup(parsed.aptos) ? parsed.aptos : { nextGroupId: 1, groups: [] },
    };
  } catch (e) {
    console.error("解析 localStorage 分组数据失败:", e);
    return getEmptyFavoriteGroupState();
  }
}


// 将收藏分组信息安全写入 localStorage
export function saveFavoriteGroupToStorage(data: TFavoriteGroupState) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(FAVORITE_GROUP_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('保存分组信息到 localStorage 失败:', e);
  }
}
