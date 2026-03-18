// src/unit/favoriteGroupActions.ts
import { AppDispatch, RootState } from '@/store';
import { addTokenToGroup } from '@/store/favorite/favoriteGroupSlice';
import { saveFavoriteGroupToStorage } from '@/utils/favorite/favoriteGroupStorage';
import { TChainName } from '@gr/interface-base';

/**
 * 将指定 token 添加到某个分组（封装 dispatch）
 * @param dispatch Redux dispatch
 * @param chainName 链类型（如 sol、eth、bsc）
 * @param groupId 分组 ID
 * @param tokenAddress token 地址
 */
export const dispatchAddTokenToGroup = (
  dispatch: AppDispatch,
  getState: () => RootState,
  chainName: TChainName,
  groupId: string,
  tokenAddress: string
) => {
  const state = getState();
  const group = state.favoriteGroup[chainName]?.groups.find(
    (g) => g.group_id === groupId
  );

  if (group && !group.tokenAddresses.includes(tokenAddress)) {
    if (group.tokenAddresses.length < 500) {
    //   dispatch(addTokenToGroup([chainType, groupId, tokenAddress]));
    dispatch(addTokenToGroup({chainName, groupId, tokenAddress}));

      // ✅ 同步持久化
      const updatedGroup = {
        ...group,
        tokenAddresses: [...group.tokenAddresses, tokenAddress],
      };

      const updatedGroups = state.favoriteGroup[chainName].groups.map((g) =>
        g.group_id === groupId ? updatedGroup : g
      );

      saveFavoriteGroupToStorage({
        ...state.favoriteGroup,
        [chainName]: {
          ...state.favoriteGroup[chainName],
          groups: updatedGroups,
        },
      });
    }
  }
};
