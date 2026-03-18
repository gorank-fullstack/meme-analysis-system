/**
 * favoriteTokenSlice.ts
 * 
 * 功能说明：
 * 本模块是 Redux 的收藏 Token 状态管理切片（slice）。
 * 支持每条链（sol / eth / bsc）管理用户收藏的 token，
 * 每个 token 可被加入多个自定义分组（通过 groupId 标识），结构更灵活。
 * 收藏信息会同步保存到 localStorage，确保刷新后数据不丢失。
 * 
 * 状态结构示例：
 * {
 *   sol: {
 *     'So1TokenXXX': { groupIds: ['1', '2'] },
 *     'So2TokenYYY': { groupIds: ['3'] },
 *   },
 *   eth: {
 *     '0xabc123...': { groupIds: ['1'] }
 *   }
 * }
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// import { TChainType } from '@gr/interface-base';
// import { MAX_FAVORITES_PER_CHAIN } from '@/config/favorite_const';

/* import { AppDispatch, RootState } from '@/store'; */
// import { setFavoriteToken } from '@/store/favoriteTokenSlice';
// import { setFavoriteGroups } from '@/store/favoriteGroupSlice';
import { getFavoriteTokenFromStorage, saveFavoriteTokenToStorage } from '@/utils/favorite/favoriteTokenStorage';
/* import { saveFavoriteGroupToStorage } from '@/utils/favorite/favoriteGroupStorage'; */
import { TChainName } from '@gr/interface-base';
// 每个 token 的收藏信息，记录其所属的分组 ID 数组
export type TFavoriteTokenState = {
  [chainName in TChainName]: {
    [tokenAddress: string]: {
      groupIds: string[]; // 可归属于多个分组
    };
  };
};

// 初始化：从本地存储读取收藏数据
const initialState: TFavoriteTokenState = getFavoriteTokenFromStorage();

const favoriteTokenSlice = createSlice({
  name: 'favoriteToken',
  initialState,
  reducers: {

    /**
     * 添加收藏：将某个 token 加入某个分组（不可重复添加）
     */
    // ✅ 这个仍然保留
    setFavoriteToken: (
      state,
      action: PayloadAction<{
        chainName: TChainName;
        tokenAddress: string;
        groupIds: string[];
      }>
    ) => {
      const { chainName, tokenAddress, groupIds } = action.payload;
      if (!state[chainName]) state[chainName] = {};
      state[chainName][tokenAddress] = { groupIds };
    },
    /* addFavoriteTokenToGroup: (
      state,
      action: PayloadAction<{
        chainType: TChainType;
        tokenAddress: string;
        groupId: string;
      }>
    ) => {
      const { chainType, tokenAddress, groupId } = action.payload;
      const chainTokens = state[chainType];
      const tokenEntry = chainTokens[tokenAddress];

      if (!tokenEntry) {
        // 新 token，直接初始化 groupIds
        chainTokens[tokenAddress] = { groupIds: [groupId] };
      } else {
        // 已存在的 token，避免重复添加
        if (!tokenEntry.groupIds.includes(groupId)) {
          tokenEntry.groupIds.push(groupId);
        }
      }

      saveFavoriteTokenToStorage(state);
    }, */

    /**
     * 移除收藏：将某个 token 从某个分组中移除
     */
    removeFavoriteTokenFromGroup: (
      state,
      action: PayloadAction<{
        chainName: TChainName;
        tokenAddress: string;
        groupId: string;
      }>
    ) => {
      const { chainName, tokenAddress, groupId } = action.payload;
      const tokenEntry = state[chainName][tokenAddress];

      if (tokenEntry) {
        tokenEntry.groupIds = tokenEntry.groupIds.filter((id) => id !== groupId);
        // 如果该 token 不再属于任何分组，删除整个 token 项
        if (tokenEntry.groupIds.length === 0) {
          // 可选：没有分组了就删除 token
          delete state[chainName][tokenAddress];
        }
      }

      saveFavoriteTokenToStorage(state);
    },

    /**
     * 清除指定链的所有收藏 token
     */
    clearChainFavoriteTokens: (state, action: PayloadAction<TChainName>) => {
      state[action.payload] = {};
      saveFavoriteTokenToStorage(state);
    },

    /**
     * 从 localStorage 恢复收藏数据（用于初始化场景）
     */
    restoreFromStorage: () => {
      return getFavoriteTokenFromStorage();
    },
  },
});

// 导出所有 reducer actions
export const {
  setFavoriteToken,
  // addFavoriteTokenToGroup,
  removeFavoriteTokenFromGroup,
  clearChainFavoriteTokens,
  restoreFromStorage,
} = favoriteTokenSlice.actions;

// 默认导出 reducer
// export default favoriteTokenSlice.reducer;
// ✅ 改为命名导出 Reducer
export const favoriteTokenReducer = favoriteTokenSlice.reducer;
