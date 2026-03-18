/**
 * favoriteTokenGroupActions.ts
 *
 * 📌 实现功能：
 * - 提供 token 与收藏分组之间的操作函数
 * - 支持将某个 token 添加到指定分组中（addFavoriteTokenToGroup）
 * - 支持将某个 token 从指定分组中移除（removeFavoriteTokenFromGroup）
 * - 内部自动更新 Redux 状态和 localStorage 存储
 * - 使用统一的 updateFavoriteTokenGroupRelation 函数抽象公共逻辑
 */

import { AppDispatch, RootState } from '@/store';
import { setFavoriteToken } from '@/store/favorite/favoriteTokenSlice';
import { setFavoriteGroups } from '@/store/favorite/favoriteGroupSlice';
import { saveFavoriteTokenToStorage } from '@/utils/favorite/favoriteTokenStorage';
import { saveFavoriteGroupToStorage } from '@/utils/favorite/favoriteGroupStorage';
import { TChainName } from '@gr/interface-base';

/**
 * 内部通用函数：用于更新 token 与收藏分组之间的关系
 *
 * @param chainName - 链类型（sol / eth / bsc）
 * @param tokenAddress - token 地址
 * @param groupId - 分组 ID
 * @param action - 操作类型：'add' 表示添加；'remove' 表示移除
 * @param dispatch - Redux dispatch
 * @param state - Redux 当前状态
 */
function updateFavoriteTokenGroupRelation(
  chainName: TChainName,
  tokenAddress: string,
  groupId: string,
  action: 'add' | 'remove',
  dispatch: AppDispatch,
  state: RootState
) {
  //-------------------------------------
  // 1. 更新 favoriteToken（分组 ID 数组）
  //-------------------------------------
  const tokenMap = state.favoriteToken[chainName] || {};
  const tokenInfo = tokenMap[tokenAddress];
  const currentGroupIds = tokenInfo?.groupIds || [];

  const newGroupIds =
    action === 'add'
      ? [...new Set([...currentGroupIds, groupId])]
      : currentGroupIds.filter((id) => id !== groupId);

  dispatch(
    setFavoriteToken({
      chainName,
      tokenAddress,
      groupIds: newGroupIds,
    })
  );

  saveFavoriteTokenToStorage({
    ...state.favoriteToken,
    [chainName]: {
      ...tokenMap,
      [tokenAddress]: { groupIds: newGroupIds },
    },
  });

  //-------------------------------------
  // 2. 更新 favoriteGroup（token 列表）
  //-------------------------------------
  const groupList = state.favoriteGroup[chainName]?.groups || [];
  const groupIndex = groupList.findIndex((g) => g.group_id === groupId);

  if (groupIndex !== -1) {
    const group = groupList[groupIndex];
    const tokens = group.tokenAddresses || [];

    const newTokenList =
      action === 'add'
        ? [...new Set([...tokens, tokenAddress])]
        : tokens.filter((addr) => addr !== tokenAddress);

    const newGroup = { ...group, tokenAddresses: newTokenList };

    const newGroupList = [...groupList];
    newGroupList[groupIndex] = newGroup;

    dispatch(
      setFavoriteGroups({
        chainName: chainName,
        groups: newGroupList,
      })
    );

    saveFavoriteGroupToStorage({
      ...state.favoriteGroup,
      [chainName]: {
        ...state.favoriteGroup[chainName],
        groups: newGroupList,
      },
    });
  }
}

/**
 * 将 token 添加到指定收藏分组中
 */
export const addFavoriteTokenToGroup = (
  chainName: TChainName,
  tokenAddress: string,
  groupId: string
) => (dispatch: AppDispatch, getState: () => RootState) => {
  updateFavoriteTokenGroupRelation(chainName, tokenAddress, groupId, 'add', dispatch, getState());
};

/**
 * 将 token 从指定收藏分组中移除
 */
export const removeFavoriteTokenFromGroup = (
  chainName: TChainName,
  tokenAddress: string,
  groupId: string
) => (dispatch: AppDispatch, getState: () => RootState) => {
  updateFavoriteTokenGroupRelation(chainName, tokenAddress, groupId, 'remove', dispatch, getState());
};
