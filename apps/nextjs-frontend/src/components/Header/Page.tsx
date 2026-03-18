"use client"
import { useState, useEffect } from "react"
import Link from 'next/link';
import { useTranslation } from 'next-i18next';


import Search from '@/components/Header/_icons/Search';
import Setting from "@/components/Header/_icons/Setting";
import ArrowDown from "@/components/Header/_icons/ArrowDown";

import { useAppSelector, useAppDispatch } from '@/store/hooks';
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/store/index";
import { getThemeColorScheme } from '@/utils/ui/getThemeColorScheme';
import { setTheme } from '@/store/styles/themeSlice';
import { setLanguage } from '@/store/language/languageSlice';
// import { LanguageSwitcher } from '@/components/LanguageSwitcher/page';
// import { ThemeSwitcher } from '@/components/ThemeSwitcher/page';
/* import { getDictionary } from "@/func/getDictionary"; */
import { theme_const, language_const } from "@/config/theme_language_constants";
import { getLocalLangage } from "@/func/getLocalLangage";

import '@/i18n'; // 引入 i18n 配置文件
import "@/components/Header/css/index.css";
// import Menu from "../Menu/Page";

// 定义菜单数据
/* const menuData = [
    { id: 1, label: 'Home', path: '/' },
    {
        id: 2,
        label: 'Services',
        path: '/services',
        children: [
            { id: 21, label: 'Web Development', path: '/services/web' },
            { id: 22, label: 'App Development', path: '/services/app' },
        ],
    },
    {
        id: 3,
        label: 'About',
        path: '/about',
    },
];
 */
// 假设你通过网络请求获取语言文件
const fetchTranslations = async (lng: string) => {
    /* const response = await fetch(`../../../public/locales/${lng}/lang.json`); */
    const response = await fetch(`/locales/${lng}/lang.json`);
    const translations = await response.json();
    return translations;
};

export default function Page() {
    const dispatch = useAppDispatch();  // 使用hook.ts写法
    // const dispatch = useDispatch();  // 不使用hook.ts写法

    // 先读取 rtk store 中的【主题】
    const reduxThemeName = useAppSelector((state) => state.theme.theme_name);            // 使用hook.ts写法
    // const daisyui_themes_obj=daisyui_themes_min[reduxThemeName as keyof typeof daisyui_themes_min];

    // const themeColorScheme = getThemeColorScheme(reduxThemeName);
    // const reduxThemeSeries = useAppSelector((state) => state.theme.theme_series);            // 使用hook.ts写法

    // const reduxTheme = useSelector((state: RootState) => state.theme.theme); // 不使用hook.ts写法

    // 先读取 rtk store 中的【语言】
    const reduxLanguageName = useAppSelector((state) => state.language.language_name);           // 使用hook.ts写法
    // const reduxLanguage = useSelector((state: RootState) => state.language.language);// 不使用hook.ts写法

    const { t, i18n } = useTranslation();
    console.log('init read: reduxThemeName=', reduxThemeName);
    // console.log('init read: themeColorScheme=', themeColorScheme);
    console.log('init read: reduxLanguageName=', reduxLanguageName);

    const loadLanguage = async (lng: string) => {
        const translations = await fetchTranslations(lng);
        console.log(translations)
        i18n.addResourceBundle(lng, 'lang', translations);
        i18n.changeLanguage(lng);
    };

    /* i18n.addResourceBundle(i18n.language, 'lang', require(`/locales/${i18n.language}/lang.json`)); */
    // 手动设置加载的语言资源
    /*   i18n.addResourceBundle("en-US", 'lang', enTranslations);
      i18n.addResourceBundle("zh-CN", 'lang', zhTranslations);
      i18n.addResourceBundle("ko", 'lang', koTranslations);
      i18n.addResourceBundle("ja", 'lang', jaTranslations); */

    // const { t } = useTranslation();

    // 检查 themeStr 是否是一个函数，如果是则调用它
    /* const thmemstr = typeof tName === 'function' ? tName() : tName; */
    /* 可以使用对象的形式来管理多个状态。这样，你可以在一个 setState 调用中更新多个值。 */
    const [memuState, setMemuState] = useState({
        isSetting: false,
        isTheme: false,
        isLanguage: false,
    });

    // 更新多个状态的函数--减少多个 setState重复调用的问题(会造成重复，渲染）
    /* 对象形式的 useState：如果你希望将多个状态变量合并为一个对象，
    setState 只需要一次调用，通过展开操作符 (...prevState) 合并其他值。 */
    const updateMemuState = (newIsSetting: boolean, newIsTheme: boolean, newIsLanguage: boolean) => {
        setMemuState((prevState) => ({
            ...prevState, // 保留原有的状态
            isSetting: newIsSetting,
            isTheme: newIsTheme,
            isLanguage: newIsLanguage,
        }));
    };

    // const [initTheme, setInitTheme] = useState(false);
    // const [initLanguage, setInitLanguage] = useState(false);

    // const [selectTheme, setSelectTheme] = useState<string | null>(null);
    // const [selectLanguage, setSelectLanguage] = useState<string | null>(null);

    // 打印每次渲染的次数
    /* 这个 useEffect 没有依赖数组（即没有传递第二个参数），意味着它在 每次组件渲染时都会执行。 */
    /* useEffect(() => {
        console.log('MyComponent rendered');
    });// 没有依赖数组 */

    /* const [language, setLanguage] = useState<string| string[] | null>(null); */
    // useEffect 确保代码只在客户端执行
    /* 这个 useEffect 有一个空依赖数组（[]），表示它 仅在组件首次渲染时执行一次，并且之后不会再次执行，除非某些依赖发生变化（在这里依赖数组为空，意味着没有依赖）。 */
    useEffect(() => {
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // 当 useEffect 的依赖数组为空时（即 []），表示该 useEffect 只会在组件首次挂载时执行一次，并且不会在后续的重新渲染中再次执行。
        // 这种写法类似于类组件中的 componentDidMount 生命周期方法。
        // 初始化时从 localStorage 加载主题设置
        // if (typeof window !== 'undefined') {
        //----获取localStorage中的【主题】----
        const localThemeName = localStorage.getItem(theme_const.theme_key);
        if (localThemeName) {
            // setSelectTheme(localTheme);
            if (localThemeName !== reduxThemeName) {
                dispatch(setTheme(localThemeName as string));
            }
            if (localThemeName !== theme_const.default_theme_name) {
                // dispatch(setTheme(localTheme as string));
                window.document.documentElement.dataset.theme = localThemeName as string;
                window.document.documentElement.setAttribute("color-scheme", getThemeColorScheme(localThemeName as string));
            }
        } else {
            // 如果没有存储的主题，默认主题为 ui_const.default_theme
            // setSelectTheme(ui_const.default_theme);

            // dispatch(setTheme(ui_const.default_theme));
        }

        console.log('localTheme:', localThemeName);
        // }

        // 当主题变化时，将其存储在 localStorage 中
        // if (reduxTheme) {
        //更新localStorage中的theme
        // localStorage.setItem(ui_const.theme_key, reduxTheme);

        //更新redux中的theme
        // dispatch(setTheme(selectTheme));

        //切换界面主题
        // window.document.documentElement.dataset.theme = localTheme as string;


        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //----获取用户的【语言偏好】----
        // 获取浏览器的默认语言
        //const  userLanguage = navigator.languages ; // 例如: "zh-CN" 或 "en-US"

        //优先读取localStorage
        let localLanguageName = localStorage.getItem(language_const.language_key);
        if (!localLanguageName) {
            // 如果没有存储的语言，则获取浏览器的默认语言
            localLanguageName = getLocalLangage(navigator.language);
            console.log('读取：navigator.language=', navigator.language);
        }

        console.log('userLanguage=', localLanguageName);
        // setSelectLanguage(userLanguage);

        if (localLanguageName) {
            // setSelectTheme(localTheme);
            if (localLanguageName !== reduxLanguageName) {
                dispatch(setLanguage(localLanguageName as string));
            }
            if (localLanguageName !== language_const.default_language_name) {
                // 例如，加载中文翻译
                loadLanguage(localLanguageName);
                i18n.changeLanguage(localLanguageName); // 切换语言
                // dispatch(setLanguage(localLanguage as string));
            }
        }

        // 当【语言】变化时，将其存储在 localStorage 中
        // if (selectLanguage) {
        //     localStorage.setItem(language_const.language_key, selectLanguage);



        // }
    }, []);

    // 当主题变化时，将其存储在 localStorage 中．并切换主题
    /* useEffect(() => {
        if(!initTheme)
        {
        // 初始化时从 localStorage 加载主题设置
        // if (typeof window !== 'undefined') {
        //----获取localStorage中的【主题】----
        const localTheme = localStorage.getItem(ui_const.theme_key);
        if (localTheme) {
            // setSelectTheme(localTheme);
            if (localTheme !== reduxTheme) {
                dispatch(setTheme(localTheme as string));
            }
        } else {
            // 如果没有存储的主题，默认主题为 ui_const.default_theme
            // setSelectTheme(ui_const.default_theme);

            // dispatch(setTheme(ui_const.default_theme));
        }

        console.log('localTheme:', localTheme);
        // }

        // 当主题变化时，将其存储在 localStorage 中
        // if (reduxTheme) {
        //更新localStorage中的theme
        // localStorage.setItem(ui_const.theme_key, reduxTheme);

        //更新redux中的theme
        // dispatch(setTheme(selectTheme));

        //切换界面主题
        window.document.documentElement.dataset.theme = localTheme as string;
        // }
        //**** 这个useEffect函数的执行条件:
        //**** a.组件首次挂载时（即初始化时）。
        //**** b.dispatch 或 theme 的值发生变化时。 
        setInitTheme(true);
        }
        
    }, [dispatch, reduxTheme]); */


    // 当【语言】变化时，将其存储在 localStorage 中,并切换语言
    /* useEffect(() => {
        if(!initLanguage)
        {
        //----获取用户的【语言偏好】----
        // 获取浏览器的默认语言
        //const  userLanguage = navigator.languages ; // 例如: "zh-CN" 或 "en-US"
        
        //优先读取localStorage
        let localLanguage = localStorage.getItem(language_const.language_key);
        if (!localLanguage) {
            // 如果没有存储的语言，则获取浏览器的默认语言
            localLanguage = getLocalLangage(navigator.language);
            console.log('读取：navigator.language=', navigator.language);
        }

        console.log('userLanguage=', localLanguage);
        // setSelectLanguage(userLanguage);

        if (localLanguage) {
            // setSelectTheme(localTheme);
            if (localLanguage !== reduxLanguage) {
                dispatch(setLanguage(localLanguage as string));
            }
        }

        // 当【语言】变化时，将其存储在 localStorage 中
        // if (selectLanguage) {
        //     localStorage.setItem(language_const.language_key, selectLanguage);

        // 例如，加载中文翻译
        loadLanguage(localLanguage);
        i18n.changeLanguage(localLanguage); // 切换语言
        //window.document.documentElement.dataset.theme = selectTheme;
        // }
        
        setInitLanguage(true);
        }
        
    }, [dispatch, reduxLanguage]); */
    /* Warning: React Hook useEffect has a missing dependency: 'i18n'. Either include it or remove the dependency array.
        原因：

            这是因为 useEffect 中使用了 i18n，但未将其作为依赖项添加到依赖数组中。
            React 的 react-hooks/exhaustive-deps 检查规则要求：useEffect 的依赖数组必须包含所有在 useEffect 中引用的变量或函数，以确保依赖变化时重新执行 useEffect。
            解决方法： 根据使用场景，可以采取以下措施：

            将 i18n 添加到依赖数组：

            tsx
            複製程式碼
            useEffect(() => {
                // 你的逻辑
            }, [i18n]); // 添加 i18n 到依赖数组
 */
    /* }, [selectLanguage,i18n]); */
    //添加下行，可以--忽略警告：React Hook useEffect has a missing dependency: 'i18n'. Either include it or remove the dependency array. 

    // }, [selectLanguage]);
    //const [selectLanguage, setLanguage] = useState(thmemstr);

    //用户更换：主题
    const updateTheme = (value: string) => {
        // setSelectTheme(value);
        dispatch(setTheme(value));
        //切换界面主题
        window.document.documentElement.dataset.theme = value;
        window.document.documentElement.setAttribute("color-scheme", getThemeColorScheme(value));
        // localStorage.setItem(ui_const.theme_key, value);
        //更新主题后，关闭：主题子菜单
        updateMemuState(false, false, false);

    }

    //用户更换：语言
    const updateLanguage = (value: string) => {
        // setSelectLanguage(value);
        dispatch(setLanguage(value));
        // 例如，加载中文翻译
        loadLanguage(value);
        i18n.changeLanguage(value); // 切换语言
        // localStorage.setItem(language_const.language_key, value);
        //更新：语言后，关闭：主题子菜单
        updateMemuState(false, false, false);

    }

    return (
        <>
            {/* <div style={{ backgroundColor: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>
                <h1>欢迎来到我的网站</h1>
                <p>当前主题: {theme}</p>
                <p>当前语言: {language}</p>
                
                <ThemeSwitcher />
                <LanguageSwitcher />
                
            </div> */}

            <div className="large-header">
                {/* 导航 */}
                <div className="ab-nav">
                    {/* 左-入口 */}
                    <ul className="left-entry">

                        <li>
                            <Link href="/" className="entry-title">
                                Logo
                            </Link>
                        </li>
                        <li>
                            <Link href="/?tab=pump" className="entry-title">
                                Pump
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="entry-title">
                                <span> {t('header.new')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="entry-title">
                                <span>{t('header.hot')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="entry-title">
                                <span>{t('header.wallet_tracking')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="entry-title">
                                <span>{t('header.holding')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="entry-title">
                                <span>{t('header.follow')}</span>
                            </Link>
                        </li>

                    </ul>
                    {/* 中-搜索区 */}
                    <div className="center-search-container">
                        {/* 中左-搜索输入框 */}
                        <div className="nav-search-content">
                            <input type="text" className="nav-search-input" placeholder={`请输入Token合约地址查询${reduxLanguageName}`} />
                        </div>
                        {/* 中右-搜索按钮 */}
                        <div className="nav-search-button">
                            <Search />
                        </div>
                    </div>
                    {/* 右-功能区 */}
                    <div className="right-entry">
                        {/* 将 menuData 作为 props 传递给 Menu 组件 */}
                        {/* <Menu menuData={menuData} /> */}
                        <div className="select-chain">
                            <details className="dropdown">
                                <summary className="btn m-1">SOL</summary>
                                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow">
                                    <li><Link href="#">SOL</Link></li>
                                    <li><Link href="#">ETH</Link></li>
                                </ul>
                            </details>
                        </div>
                        <div className="setting">
                            <div className="Drop_down">
                                {/* <div className="items-center justify-between flex" onClick={() => setIsSettingOpen(!isSettingOpen)}> */}
                                <div className="items-center justify-between flex" onClick={() => updateMemuState(!memuState.isSetting, false, false)}>
                                    <span>{t('header.setting')}<Setting /></span>
                                    <div className={memuState.isSetting ? "rotate-180 transition" : ""}>
                                        <ArrowDown />
                                    </div>

                                </div>
                                {/* {isSettingOpen && ( */}
                                {memuState.isSetting && (
                                    <div className="z-10">
                                        {/* <ul className="flex flex-col  absolute  shadow"> */}

                                        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-40 p-2 shadow absolute">

                                            <li className="h-[40px]"><span>钱包</span></li>
                                            <li className="h-[40px]"><span>邀请链接</span></li>

                                            <li className="h-[40px] flex flex-row">
                                                {/* <div onClick={() => setIsThemeOpen(!isThemeOpen)}> */}
                                                <div onClick={() => updateMemuState(memuState.isSetting, !memuState.isTheme, false)}>
                                                    <span className="no-wrap">主题：{reduxThemeName}</span>
                                                    {/*  <div className={isThemeOpen ? "rotate-180 transition" : ""}>
                                                        <ArrowDown />
                                                    </div> */}

                                                </div>

                                                {/* {isThemeOpen && ( */}
                                                {memuState.isTheme && (
                                                    <div className="dropdown-left bg-[oklch(var(--b1))]">
                                                        {/* <ul className="flex flex-col  absolute  shadow"> */}
                                                        {/* <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow"> */}
                                                        {/* <ul tabIndex={0} className="absolute dropdown-content menu bg-base-100 rounded-box z-1 w-48 p-2 shadow"> */}
                                                        <ul tabIndex={0} className="absolute dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow">
                                                            {/* <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow"> */}
                                                            {
                                                                theme_const.optional_themes.map((item) => {
                                                                    return (
                                                                        <li key={`theme_${item}`} onClick={() => updateTheme(`${item}`)}><Link href="#">{item}</Link></li>
                                                                    )
                                                                })

                                                            }

                                                        </ul>
                                                    </div>
                                                )}
                                            </li>
                                            <li className="h-[40px] flex flex-row">

                                                {/* <div onClick={() => setIsLanguageOpen(!isLanguageOpen)}> */}
                                                <div onClick={() => updateMemuState(memuState.isSetting, false, !memuState.isLanguage)}>
                                                    <span className="no-wrap">语言：{language_const.optional_languages_map.get(reduxLanguageName as string)}</span>
                                                </div>
                                                {/* {isLanguageOpen && ( */}
                                                {memuState.isLanguage && (
                                                    <div className="dropdown-left z-10">
                                                        <ul tabIndex={0} className="absolute dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow">
                                                            {
                                                                language_const.optional_languages_key_text.map((item) => {
                                                                    return (
                                                                        <li key={`lang_${item[0]}`} onClick={() => updateLanguage(`${item[0]}`)}><Link href="#">{item[1]}</Link></li>
                                                                    )
                                                                })

                                                            }
                                                        </ul>
                                                    </div>
                                                )}
                                            </li>


                                        </ul>
                                    </div>
                                )}

                            </div>
                            {/* <details className="dropdown">
                                <summary className="btn m-1">设置</summary>
                                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow">
                                <li><a>设置 1</a></li>
                                <li><a>设置 2</a></li>
                                <li><a>设置 3</a></li>
                                </ul>
                            </details> */}
                        </div>
                        <div className="person">
                            <details className="dropdown">
                                <summary className="btn m-1">个人</summary>
                                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow">
                                    <li className="h-[40px]"><Link href="#">菜单 1</Link></li>
                                    <li className="h-[40px]">
                                        {/* <a>菜单 2</a> */}
                                    </li>
                                    <li className="h-[40px]"><Link href="#">菜单 3</Link></li>
                                </ul>
                            </details>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
