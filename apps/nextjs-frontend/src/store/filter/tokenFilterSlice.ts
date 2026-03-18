// src/store/tokenFilterSlice.ts
// 20250719新加－－预留．等实现收藏后，实现：过滤功能
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TokenFilterState {
  chainName: 'sol' | 'eth' | 'bsc';     // 当前链类型
  sortBy: 'volume' | 'price' | 'hot';   // 排序方式
  timeFrame: '5m' | '1h' | '24h';       // 时间段
  keyword: string;                      // 搜索关键词
  onlyFavorites: boolean;              // 只显示收藏的 token？
}

const initialState: TokenFilterState = {
  chainName: 'sol',
  sortBy: 'hot',
  timeFrame: '5m',
  keyword: '',
  onlyFavorites: false,
};

export const tokenFilterSlice = createSlice({
  name: 'tokenFilter',
  initialState,
  reducers: {
    setChainName: (state, action: PayloadAction<TokenFilterState['chainName']>) => {
      state.chainName = action.payload;
    },
    setSortBy: (state, action: PayloadAction<TokenFilterState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setTimeFrame: (state, action: PayloadAction<TokenFilterState['timeFrame']>) => {
      state.timeFrame = action.payload;
    },
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
    toggleOnlyFavorites: (state) => {
      state.onlyFavorites = !state.onlyFavorites;
    },
    resetFilter: () => initialState,
  },
});

// ✅ 命名导出（建议你现在统一规范）
export const {
  setChainName: setChainName,
  setSortBy,
  setTimeFrame,
  setKeyword,
  toggleOnlyFavorites,
  resetFilter,
} = tokenFilterSlice.actions;

export const tokenFilterReducer = tokenFilterSlice.reducer;
