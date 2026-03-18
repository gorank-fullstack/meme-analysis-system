import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TChainName } from '@gr/interface-base';
import { MAX_GROUPS_PER_FAVORITE, MAX_GROUP_COUNT_PER_CHAIN } from '@/config/favorite_const';
import { getFavoriteGroupFromStorage, saveFavoriteGroupToStorage } from '@/utils/favorite/favoriteGroupStorage'; // ⬅️ 加在文件顶部

// 收藏分组结构定义
export interface IFavoriteGroupItem {
  group_id: string;              // 分组 ID（链内唯一，当前为自增 string）
  user_id: string;              // 用户 ID（未登录可为 'guest' 或空字符串）
  name: string;                 // 分组名称
  index: number;                // 排序索引（前端显示用）
  tokenAddresses: string[];     // 当前分组下收藏的 tokenAddress 列表
}

// 每条链的收藏分组状态
export type TFavoriteGroupState = {
  [chain in TChainName]: {
    groups: IFavoriteGroupItem[];
    nextGroupId: number; // 分组 ID 自增计数器（链内）
  };
};

// 初始状态－确保每次重启NextJs都有新的收藏id．后续再对接到pgSql的收藏id
/* 
const getInitialNextGroupId = () => Math.floor(Date.now() / 1000); // 秒级时间戳，确保每次重启唯一

const initialState: TFavoriteGroupState = {
  sol: { groups: [], nextGroupId: getInitialNextGroupId() },
  eth: { groups: [], nextGroupId: getInitialNextGroupId() },
  bsc: { groups: [], nextGroupId: getInitialNextGroupId() },
}; */

// 初始化时自动创建“默认”分组逻辑
function ensureDefaultGroupForChainState(
  chainState: { groups: IFavoriteGroupItem[]; nextGroupId: number }
): { groups: IFavoriteGroupItem[]; nextGroupId: number } {
  if (chainState.groups.length > 0) return chainState;

  // 仅当该链 groups 为空时，才创建默认分组（防止多次创建）
  // 默认分组 group_id 从 nextGroupId 获取，避免任何冲突
  const defaultId = chainState.nextGroupId.toString();
  const defaultGroup: IFavoriteGroupItem = {
    group_id: defaultId,
    user_id: 'guest',
    name: '默认',
    index: 0,
    tokenAddresses: [],
  };

  return {
    groups: [defaultGroup],
    nextGroupId: chainState.nextGroupId + 1,
  };
}

// 初始化，改为从：localStorage读取
const rawState = getFavoriteGroupFromStorage();
const getInitialNextGroupId = () => Math.floor(Date.now() / 1000);

function ensureChainState(chain: TChainName): { groups: IFavoriteGroupItem[]; nextGroupId: number } {
  const rawChainState = rawState[chain] || { groups: [], nextGroupId: getInitialNextGroupId() };
  return ensureDefaultGroupForChainState(rawChainState);
}

// 每条链在 Rtk 初始化时都会自动拥有一个“默认”分组
const initialState: TFavoriteGroupState = {
  // SPL
  sol: ensureChainState("sol"),

  // EVM
  eth: ensureChainState("eth"),
  bsc: ensureChainState("bsc"),
  base: ensureChainState("base"),
  aval: ensureChainState("aval"),
  arb: ensureChainState("arb"),
  linea: ensureChainState("linea"),
  pulse: ensureChainState("pulse"),
  polygon: ensureChainState("polygon"),
  optimism: ensureChainState("optimism"),
  moonbeam: ensureChainState("moonbeam"),
  gnosis: ensureChainState("gnosis"),
  ronin: ensureChainState("ronin"),
  fantom: ensureChainState("fantom"),
  cronos: ensureChainState("cronos"),
  lisk: ensureChainState("lisk"),
  chiliz: ensureChainState("chiliz"),
  blast: ensureChainState("blast"),
  sonic: ensureChainState("sonic"),
  hyper: ensureChainState("hyper"),
  sei: ensureChainState("sei"),
  uni: ensureChainState("uni"),
  "x-layer": ensureChainState("x-layer"),

  // TVM
  tron: ensureChainState("tron"),

  // FVM
  flow: ensureChainState("flow"),

  // TAO
  bittensor: ensureChainState("bittensor"),

  // Move
  sui: ensureChainState("sui"),
  aptos: ensureChainState("aptos"),
};



// 创建收藏分组 Payload
interface CreateGroupPayload {
  chainName: TChainName;
  name: string;
  user_id?: string; // 可选，未传默认 guest
}

export const favoriteGroupSlice = createSlice({
  name: 'favoriteGroup',
  initialState,
  reducers: {
    // 替换某条链的分组列表（用于从 thunk 外部整体更新）
    setFavoriteGroups(
      state,
      action: PayloadAction<{ chainName: TChainName; groups: IFavoriteGroupItem[] }>
      // action: PayloadAction<[TChainType, string, string]> // ✅ 接收三个参数
    ) {
      const { chainName, groups } = action.payload;
      // const [chainType, group_id, tokenAddress] = action.payload;

      // 只替换 groups，不动 nextGroupId（由 createGroup 单独管理）
      if (!state[chainName]) {
        state[chainName] = {
          groups: [],
          nextGroupId: Math.floor(Date.now() / 1000), // 若不存在该链，初始化
        };
      }

      state[chainName].groups = groups;

      // ✅ 同步到 localStorage
      saveFavoriteGroupToStorage(state);
    },
    // 新增分组
    createGroup(state, action: PayloadAction<CreateGroupPayload>) {
      const { chainName, name, user_id = 'guest' } = action.payload;
      const chainState = state[chainName];

      if (chainState.groups.length >= MAX_GROUP_COUNT_PER_CHAIN) return; // 超出最大分组数量限制

      const nextId = chainState.nextGroupId.toString();
      chainState.nextGroupId += 1;

      const newGroup: IFavoriteGroupItem = {
        group_id: nextId,
        user_id,
        name,
        index: chainState.groups.length,
        tokenAddresses: [],
      };

      chainState.groups.push(newGroup);
      // ✅ 同步到 localStorage
      saveFavoriteGroupToStorage(state);
    },

    // 删除分组（根据 group_id）
    deleteGroup(state, action: PayloadAction<{ chainName: TChainName; group_id: string }>) {
      const { chainName, group_id } = action.payload;
      const chainState = state[chainName];

      chainState.groups = chainState.groups.filter((g) => g.group_id !== group_id);
      // ✅ 同步到 localStorage
      saveFavoriteGroupToStorage(state);
    },

    // 重命名分组
    renameGroup(state, action: PayloadAction<{ chainName: TChainName; group_id: string; newName: string }>) {
      const { chainName, group_id, newName } = action.payload;
      const group = state[chainName].groups.find((g) => g.group_id === group_id);
      if (group) {
        group.name = newName;
        // ✅ 同步到 localStorage
        saveFavoriteGroupToStorage(state);
      }
    },

    // 给某个分组添加 token（最多 MAX_GROUPS_PER_FAVORITE 个）
    addTokenToGroup(
      state,
      action: PayloadAction<{ chainName: TChainName; groupId: string; tokenAddress: string }>
    ) {
      const { chainName, groupId, tokenAddress } = action.payload;
      const group = state[chainName].groups.find((g) => g.group_id === groupId);

      if (group && !group.tokenAddresses.includes(tokenAddress)) {
        if (group.tokenAddresses.length < MAX_GROUPS_PER_FAVORITE) {
          group.tokenAddresses.push(tokenAddress);

          // ✅ 同步到 localStorage
          saveFavoriteGroupToStorage(state);
        }
      }
    },

    // 从某个分组移除 token
    removeTokenFromGroup(
      state,
      action: PayloadAction<{ chainName: TChainName; group_id: string; tokenAddress: string }>
    ) {
      const { chainName, group_id, tokenAddress } = action.payload;
      const group = state[chainName].groups.find((g) => g.group_id === group_id);
      if (group) {
        group.tokenAddresses = group.tokenAddresses.filter((addr) => addr !== tokenAddress);

        // ✅ 同步持久化到 localStorage
        saveFavoriteGroupToStorage(state);
      }
    },

    // 排序，仅支持，向上排序(不支持拖拽，也不显示“向下”按钮)
    reorderGroup: (
      state,
      action: PayloadAction<{
        chainName: TChainName;
        group_id: string;
      }>
    ) => {
      const { chainName, group_id } = action.payload;
      const groupState = state[chainName];
      const index = groupState.groups.findIndex((g) => g.group_id === group_id);
      if (index > 0) {
        const tmp = groupState.groups[index - 1];
        groupState.groups[index - 1] = groupState.groups[index];
        groupState.groups[index] = tmp;
      }
    },
  },
});

// 导出 reducer actions（命名导出）
export const {
  setFavoriteGroups,
  createGroup,
  deleteGroup,
  renameGroup,
  addTokenToGroup,
  removeTokenFromGroup,
  reorderGroup,
} = favoriteGroupSlice.actions;

// export default favoriteGroupSlice.reducer;

// ✅ 改为命名导出 Reducer
export const favoriteGroupReducer = favoriteGroupSlice.reducer;
