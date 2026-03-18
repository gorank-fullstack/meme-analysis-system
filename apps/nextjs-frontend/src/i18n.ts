// i18n.tsx
/* 仅在服务器端运行 */
// import 'server-only';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
//import HttpBackend from 'i18next-http-backend';
// import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend'

// import LocalStorageBackend from 'i18next-localstorage-backend';

/* ChatGPT 說：
ChatGPT
是的，i18next 可以在不使用 i18next-browser-languagedetector 的情况下运行。
你可以通过自定义逻辑手动设置或检测语言，而无需依赖该插件。 */
// import LanguageDetector from 'i18next-browser-languagedetector';

import { language_const } from '@/config/theme_language_constants';

i18n

  // .use(Backend) // 使用 fs 后端加载文件
  // .use(HttpBackend) // 使用 HttpBackend 加载语言文件（导致编译不过的主要原因。禁用，改成运行时，动态加载）
  // .use(LanguageDetector) // 自动检测用户语言(禁用，不会在浏览器的Local Storage保存key：'i18nextLng')
  .use(initReactI18next) // 绑定到 React
  /* .init<HttpBackendOptions>({ */
  .init({
    /*  resources, */
    /* debug: true, */ // Build时，要关闭debug
    //fallbackLng:  "en-US", // 默认语言
    //supportedLngs: ["en-US","zh-CN","ko","ja"], // 支持的语言列表 
    fallbackLng: language_const.default_language_name, // 默认语言
    supportedLngs: [
      language_const.language_en_us_key,
      language_const.language_zh_cn_key,
      language_const.language_ko_key,
      language_const.language_ja_key,], // 支持的语言列表
    // ns: ['common'], // 命名空间
    //defaultNS: 'common', // 默认命名空间 
    ns: [language_const.default_name_space], // 命名空间
    defaultNS: language_const.default_name_space, // 默认命名空间
    debug: false, // 调试模式
    interpolation: {
      escapeValue: false, // React 已经自动处理 XSS
    },
    //backend: {
    //  loadPath: '/locales/{{lng}}/{{ns}}.json', // 语言文件的加载路径
    //   expirationTime: 60 * 60 * 24 * 30,  // 缓存过期时间，单位为秒（例如：30天） 
    //},
    react: {
      useSuspense: false,  // 是否启用 Suspense（默认为 false，适合服务端渲染）
    },
  });
/* }

initializeI18n(); */
/* } */

export default i18n;

/* 
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// 初始化 i18n 配置
i18n
  .use(HttpBackend) // 使用 HttpBackend 加载语言文件
  .use(LanguageDetector) // 自动检测用户语言
  .use(initReactI18next) // 绑定到 React
  .init({
    fallbackLng: 'en', // 默认语言
    supportedLngs: ['en', 'fr', 'es'], // 支持的语言列表
    ns: ['common'], // 命名空间
    defaultNS: 'common', // 默认命名空间
    debug: false, // 调试模式
    interpolation: {
      escapeValue: false, // React 已经自动处理 XSS
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // 语言文件的加载路径
    },
  });

export default i18n; */
