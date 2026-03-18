// store/languageSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { language_const } from '@/config/theme_language_constants';

interface LanguageState {
  language_name: string;
}

const initialState: LanguageState = {
  //   language: 'en', // 默认语言为 'en'
  language_name: language_const.default_language_name, // 默认语言为 'en-US'
};

const languageSlice = createSlice({
  name: language_const.language_slice_name,// slice 的名称
  // name: "value",// slice 的名称
  initialState,    // 初始状态

  // 自动合并 reducer
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language_name = action.payload;// 通过 action 传递参数
      if (typeof window !== 'undefined') {
        localStorage.setItem(language_const.language_key, state.language_name);// 同步到 localStorage
        // 例如，加载中文翻译
        // loadLanguage(state.language);
        // i18n.changeLanguage(state.language); // 切换语言
      }
    },
  },
});
// 自动生成 action creators
export const { setLanguage } = languageSlice.actions;

// 导出 reducer
// export default languageSlice.reducer;
// ✅ 改为命名导出 Reducer
export const languageReducer = languageSlice.reducer;