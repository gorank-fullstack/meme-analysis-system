// store/index.ts
'use client'; // 指定该组件为客户端组件

import { configureStore } from '@reduxjs/toolkit';

import { themeReducer } from '@/store/styles/themeSlice';
import { languageReducer } from '@/store/language/languageSlice';
import { favoriteTokenReducer } from '@/store/favorite/favoriteTokenSlice';
import { favoriteGroupReducer } from '@/store/favorite/favoriteGroupSlice';

/**
 * 全局 Redux Store 配置
 * 
 * 包含以下模块：
 * - theme:          主题切换状态
 * - language:       多语言状态
 * - favoriteToken:  收藏的 token 状态（按链划分）
 * - favoriteGroup:  收藏分组状态（按链划分）
 */

// import favoriteTokenSlice from '@/store/favoriteTokenSlice'; // ✅ 新增收藏 reducer

/* 
Redux Toolkit ➜ 用 configureStore
传统 Redux ➜ 才会手动用 combineReducers
 */
/* const rootReducer = combineReducers({
  theme: themeReducer,
  language: languageReducer,
  favoriteToken: favoriteTokenReducer, // ✅ 保持与 slice 命名一致
  favoriteGroup: favoriteGroupReducer,
}); */
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    favoriteToken: favoriteTokenReducer,
    favoriteGroup: favoriteGroupReducer,
  },
});

// RootState 类型（用于 useSelector 的类型提示）
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch 类型（用于 useDispatch 的类型提示）
export type AppDispatch = typeof store.dispatch;

// 如果你使用 Redux Provider，可以在其他地方直接 import { store }
