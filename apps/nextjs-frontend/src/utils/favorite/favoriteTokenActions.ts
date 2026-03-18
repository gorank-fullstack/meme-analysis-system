/**
 * favoriteTokenActions.ts
 * 
 * ✅ 跨 Slice 收藏行为封装模块（双向同步）
 * 
 * 功能说明：
 * 本模块封装了用户收藏 token 与收藏分组之间的「双向同步行为」：
 * - 添加收藏时：同步更新 token → group 与 group → token 的映射关系
 * - 移除收藏时：同步删除 token → group 与 group → token 的映射关系
 * - 持久化存储：依赖各自 reducer 中的 saveFavoriteTokenToStorage / saveFavoriteGroupToStorage 自动完成
 * 
 * 适用场景：
 * - 在收藏弹窗（FavoriteDialog）中调用，处理用户对某个 token 勾选/取消分组的交互
 * - 后续可扩展为批量添加 / 移除 / 移动分组 等复杂操作的统一入口
 * 
 * 依赖模块：
 * - favoriteTokenSlice.ts：用于管理每个 token 所属的 groupIds
 * - favoriteGroupSlice.ts：用于管理每个 group 包含的 tokenAddresses
 * 
 * 命名规范说明：
 * - addTokenToGroupBidirectionally(...)  添加双向收藏关系
 * - removeTokenFromGroupBidirectionally(...) 移除双向收藏关系
 * - dispatch: AppDispatch 为标准 Redux 调用接口，确保类型推导准确
 */


import { AppDispatch } from '@/store';
import {  TChainName } from '@gr/interface-base';

import { addFavoriteTokenToGroup } from '@/utils/favorite/favoriteTokenGroupActions';
import { removeFavoriteTokenFromGroup } from '@/store/favorite/favoriteTokenSlice';

import { addTokenToGroup, removeTokenFromGroup } from '@/store/favorite/favoriteGroupSlice';

/**
 * 将某个 token 添加到指定分组（双向同步）
 */
export function addTokenToGroupBidirectionally(
    dispatch: AppDispatch,
    chainName: TChainName,
    tokenAddress: string,
    groupId: string
) {
    dispatch(addFavoriteTokenToGroup(chainName, tokenAddress, groupId));
    dispatch(addTokenToGroup({  chainName, groupId, tokenAddress }));
}

/**
 * 将 token 从某个分组中移除（双向同步）
 * 同时更新 favoriteTokenSlice 和 favoriteGroupSlice 的状态
 */
export function removeTokenFromGroupBidirectionally(
    dispatch: AppDispatch,
    chainName: TChainName,
    tokenAddress: string,
    groupId: string
) {
    dispatch(removeFavoriteTokenFromGroup({ chainName, tokenAddress, groupId }));
    dispatch(removeTokenFromGroup({ chainName, group_id: groupId, tokenAddress }));
}