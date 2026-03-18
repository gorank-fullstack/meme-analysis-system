/* 仅在服务器端运行 */
import 'server-only';

/* import { GetStaticProps } from 'next'; */
interface IDictonary {
    // 根据字典内容定义
  /*   [key: string]: string; */
  header: {
    new: string;
    hot: string;
    wallet_tracking: string;
    holding: string;
    follow: string;
    setting: string;
    };
}

// 将浏览器偏好语言的标识，映射到本地语言文件
/* const dictonaries: { [key: string]: () => Promise<IDictonary> } = {
    //文件加载
    'en-US': () => import('./dictionary/en-US.json').then((module) => module.default),
    'ja': () => import('./dictionary/ja.json').then((module) => module.default),
} */
/*     const dictonaries = {
        //文件加载
        'en-US': () => import('./dictionary/en-US.json').then((module) => module.default),
        'ja': () => import('./dictionary/ja.json').then((module) => module.default),
    }
 */
const dictionaries: { [key: string]: () => Promise<IDictonary> } = {/* 
    'en-US': () => import('@/lang/en-US.json').then((module) => module.default),
    'zh-CN': () => import('@/lang/zh-CN.json').then((module) => module.default), */
    /* 'ja': () => import('@/lang/ja.json').then((module) => module.default), */
}
//导出语言包的调用函数
/*  export const getDictionary:GetStaticProps = async (locale: 'en-US'|'ja')  => {
 
     //加载语言包
     const dictionaryLoader = dictonaries[locale] || dictonaries['en-US']
     if(!dictionaryLoader)
     {
         throw new Error(`No dictionary found for locale: ${locale}`);
     }
     return dictionaryLoader();
 }    */
export const getDictionary = async (locale: 'en-US' | 'zh-CN') =>
    dictionaries[locale]()