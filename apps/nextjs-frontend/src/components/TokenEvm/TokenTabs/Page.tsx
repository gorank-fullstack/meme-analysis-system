"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Tab = {
    id: string;
    label: string;
};

interface TokenTabsProps {
    // activeTab: string;
    // onChange: (tabId: string) => void;
    initialTab: string;
    isSolana: boolean;
}


// const TokenTabs = ({ activeTab, isSolana }: TokenTabsProps) => {
export const EvmTokenTabs = ({ initialTab, isSolana }: TokenTabsProps) => {
    const tabKey: string = "active_tab_evm";
    const router = useRouter();
    const searchParams = useSearchParams();

    // 1. 组件状态：初始设置为空字符串，稍后在 useEffect 里初始化
    // const [activeTab, setActiveTab] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>(initialTab);
    // const [activeTab, setActiveTab] = useState<string>("transactions");
    const tabs: Tab[] = [
        /* { id: "transactions", label: "Transactions" }, */
        { id: "transactions", label: "交易活动" },
        ...(isSolana
            ? [
                /* { id: "holders", label: "Holders" }, */
                { id: "holders", label: "持币地址" },
                /* { id: "holder-insights", label: "Holder Insights" }, */
                { id: "holder-insights", label: "持币分析" },
            ]
            : [
                /* { id: "holders", label: "Holders" }, */
                { id: "holders", label: "持币地址" },
                /* { id: "holder-insights", label: "Holder Insights" }, */
                { id: "holder-insights", label: "持币分析" },
            ]),
        /* { id: "snipers", label: "Snipers" }, */
    ];

    


    // 2:初始化：读取 localStorage 或 url 参数
    /* useEffect(() => {
      // 有tab的url参数时，优先使用url参数。若没有，才使用：localStorage
      // 即没有：url参数，也没有localStorage的activeTab值，才使用默认
      const urlTab = searchParams.get("tab");
      const storedTab = localStorage.getItem("activeTab");
      const defaultTab = "transactions";
  
      const initialTab =
        (urlTab && tabs.find((t) => t.id === urlTab)?.id) ||
        (storedTab && tabs.find((t) => t.id === storedTab)?.id) ||
        defaultTab;
  
      setActiveTab(initialTab);
      localStorage.setItem("activeTab", initialTab);
    }, [isSolana, searchParams]); */
    useEffect(() => {
        localStorage.setItem(tabKey, initialTab);
    }, [initialTab]);

    // 2. 初始化：从 localStorage 读取，如果没有就用默认 "transactions"
    /* useEffect(() => {
      const storedTab = localStorage.getItem("activeTab");
      const validTab = tabs.find((tab) => tab.id === storedTab);
      if (storedTab && validTab) {
        setActiveTab(storedTab);
      } else {
        setActiveTab("transactions"); // 默认 tab
      }
    }, [isSolana]); // 每次 isSolana 变化也重新确认 tab 合法性 */

    // 3:点击切换 tab：更新状态 + localStorage + URL 参数
    const handleClick = (tabId: string) => {
        setActiveTab(tabId);
        localStorage.setItem(tabKey, tabId);

        // 构造新的 URL 参数
        const params = new URLSearchParams(searchParams.toString());
        /* 
        window.location.search 是浏览器原生写法
        示例：window.location.search 会直接是 "?tab=holders&sort=desc" 字符串。
        但：它 不能在 SSR 或服务器组件中使用（因为 window 只存在于浏览器端）。
         */
        // const params = new URLSearchParams(window.location.search);
        params.set("tab", tabId);

        /* 
        更新url方法一：router.replace() 替换 URL 时重新执行了当前 route 的 client-side 渲染逻辑，尤其是当你在 page.tsx 或 layout 组件中使用了依赖 searchParams 的逻辑时。
    
        router.replace('?tab=xxx') 在 App Router 中不会触发整页刷新，但：
        它 会触发页面组件（如 page.tsx）中使用 useSearchParams() 的组件重新执行。
        如果你在 page.tsx、layout.tsx 或某些 useEffect() 中依赖了 searchParams，这就像“刷新了组件”。
         */

        /* 
        更新url方法2：提取 activeTab 到父组件，避免页面层使用 searchParams 来初始化
        最理想的做法是：
        在 TokenTabs 内部只用 useState 控制 UI 状态
        只在初次挂载从 localStorage 或 searchParams 初始化
        页面其它组件避免直接使用 searchParams.get("tab") 来渲染不同组件
         */

        /* 
        更新url方法3：使用 window.history.replaceState（完全避免 Next.js router 导致的渲染）
         */
        router.replace(`?${params.toString()}`);
        // const newUrl = `${window.location.pathname}?${params.toString()}`;
        // window.history.replaceState(null, "", newUrl); // 不触发 Next.js 重新渲染
    };
    // 3. 点击按钮：更新状态 + 存入 localStorage
    /* const handleClick = (tabId: string) => {
      setActiveTab(tabId);
      localStorage.setItem("activeTab", tabId);
    }; */

    /* return (
        <div className="flex border-b border-dex-border">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`px-6 py-3 font-medium text-sm ${activeTab === tab.id
                        
                        ? "primary border-b-2 border-dex-blue"
                        : "text-dex-text-secondary hover:accent"
                        }`}

                    // onClick={() => onChange(tab.id)}
                    onClick={() => handleClick(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    ); */
    return (
        <div className="flex border-b pb-1">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`
                        relative !px-6 !py-3 font-medium text-sm transition-all duration-200
                        ${activeTab === tab.id
                            ? "primary font-semibold" // 激活状态样式
                            : "text-secondary hover:accent" // 非激活状态和悬停样式
                        }
                    `}
                    onClick={() => handleClick(tab.id)}
                >
                    {tab.label}
                    {/* 激活状态下的底部指示条 */}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                    )}
                </button>
            ))}
        </div>
    );
};
