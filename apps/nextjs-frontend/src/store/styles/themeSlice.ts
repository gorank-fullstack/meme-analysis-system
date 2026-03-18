// store/themeSlice.ts
/* 
20250718取消：heme_series字段，直接引入：
u_nextjs_nextauth_rtk/src/styles/daisyui/theme_min.ts
就能读取到，当前主题所属的：深／浇色系列

 */

"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { theme_const } from '@/config/theme_language_constants';
// import { getThemeSeries } from '@/unit/theme';

interface ThemeState {
  theme_name: string;
  /* theme_series: string | null; */
}

// const savedTheme = getThemeFromStorage();

function getThemeNameFromStorage(): string {
  if (typeof window === 'undefined') return theme_const.default_theme_name;
  return localStorage.getItem(theme_const.theme_key) || theme_const.default_theme_name;
}

/* function getThemeSeriesFromStorage(): string {
  return getThemeSeries(getThemeNameFromStorage()) ?? theme_const.default_theme_series;
} */

const initialState: ThemeState = {
  theme_name: getThemeNameFromStorage(),
  /* theme_series: getThemeSeriesFromStorage(), */
};

const themeSlice = createSlice({
  name: theme_const.theme_slice_name,// slice 的名称
  // name: "value",// slice 的名称
  initialState, // 初始状态

  // 自动合并 reducer
  reducers: {
    setTheme(state, action: PayloadAction<string>) {

      state.theme_name = action.payload; // 通过 action 传递参数
      // ✅ 同步更新 theme_series
      /* state.theme_series = getThemeSeries(action.payload) ?? theme_const.default_theme_series; */

      if (typeof window !== 'undefined') {
        localStorage.setItem(theme_const.theme_key, state.theme_name);// 同步到 localStorage
        //切换界面主题
        // window.document.documentElement.dataset.theme = state.theme;
      }
      /* if (typeof window !== 'undefined') {
        localStorage.setItem(ui_const.theme_key, state.theme); // 同步到 localStorage
      } */
    },
  },
});
// 自动生成 action creators
export const { setTheme } = themeSlice.actions;

// 导出 reducer
// export default themeSlice.reducer;
// ✅ 改为命名导出 Reducer
export const themeReducer = themeSlice.reducer;
