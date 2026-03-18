// components/layout/TopBar/index.tsx
"use client";
// import { useRouter } from "next/router";      //pages/ 目录.CSR only（仅客户端）
import { useRouter, useSearchParams } from "next/navigation";  //App目录结构。支持 React 服务器组件架构（但 hook 只能用在客户端组件）
import React from "react";
// import FilterTools from "./FilterTools";
import { SplTrendingFilterTools } from "@/components/Trending/TrendingFilterTools/Page";
// 导入组件
import { BscLogo } from '@/components/icons/chain/BscLogo';
import { EthLogo } from '@/components/icons/chain/EthLogo';
import { SolLogo } from '@/components/icons/chain/SolLogo';
import Link from "next/link";
// import CustomFilter from "@/components/modals/CustomFilter/Page";
// import { FilterLine } from "@/components/icons/operate/FilterLine";
// 建立组件映射对象
/* 
组件映射:推荐用:React.ComponentType
更通用（支持函数组件 + 类组件）
没有隐式注入 children,类型推断更灵活
 */
// const iconsMap: Record<string, React.FC<any>> = {
/* const iconsMap: Record<string, React.ComponentType> = {
  BscLogo,
  EthLogo,
  SolLogo,
}; */

interface TopBarProps {
  chainName?: string;
  isFiltered: boolean;
  openFiltersModal: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const TrendingTopBar = ({
  chainName,
  isFiltered,
  openFiltersModal,
  sortBy,
  onSortChange,
}: TopBarProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();                    // ✅ 读 URL 参数
  const currentChain = (
    searchParams.get("chain") || chainName || "sol"          // 无参时默认 sol
  ).toLowerCase();
  /* const networks = [
    { id: "", name: "All Chains", icon: "🌐" },
    { id: "solana", name: "Solana", icon: "🟣" },
    { id: "ethereum", name: "Ethereum", icon: "🔷" },
    { id: "base", name: "Base", icon: "🅱️" },
    { id: "bsc", name: "BSC", icon: "🟡" },
    { id: "ronin", name: "Ronin", icon: "🦊" },
  ]; */
  const networks = [
    // { id: "", name: "All Chains", logo: "🌐" },
    { id: "sol", name: "Sol", logo: "SolLogo" },
    { id: "eth", name: "Eth", logo: "EthLogo" },
    // { id: "base", name: "Base", logo: "🅱️" },
    { id: "bsc", name: "Bsc", logo: "BscLogo" },
    // { id: "ronin", name: "Ronin", logo: "🦊" },
  ];

  const pages = [
    /* { id: "portfolio", name: "Portfolio", icon: "💼" },
    { id: "pumpfun", name: "Pump.fun", icon: "🚀" }, */
    { id: "hot", name: "热门", icon: "💼" },
    { id: "new", name: "新币", icon: "🚀" },
    { id: "pump", name: "Pump", icon: "🚀" },
  ];

  // const chainLogoWidth = 30;
  // const chainLogoHeight = 30;
  

  return (
    // <div className="bg-dex-bg-secondary border-b border-dex-border p-4 sticky top-0 z-10">
    <div className="border-b border-dex-border p-4 sticky top-0 z-10">
      <div className="flex items-center justify-start flex-wrap gap-3">
        {/* <div className="flex items-left justify-between flex-col gap-3"> */}
        {/* Network buttons */}
        {/* 链选择 */}
        <div className="flex items-center gap-3">
          {networks.map((network) => {
            const id = network.id.toLowerCase();
            const active = id === currentChain;               // ✅ 用 currentChain 判断

            return (
              <button
                key={id}
                onClick={() => router.push(`/?chain=${id}`)}
                aria-pressed={active}
                title={network.name}
                className={[
                  "inline-flex items-center justify-center",
                  // 比图标大一圈，留出内边距
                  "w-10 h-10 md:w-11 md:h-11 rounded-2xl p-1.5",
                  "transition-all duration-150 focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-white/30",
                  active
                    ? "bg-neutral-800/90 ring-2 ring-yellow-400 shadow-lg" // 选中：深灰底 + 外环高亮 + 投影
                    : "bg-transparent hover:bg-white/10", // 未选中
                ].join(" ")}
              >
                <div className="w-7 h-7 md:w-8 md:h-8">
                  {network.logo === "SolLogo" ? (
                    <SolLogo width="100%" height="100%" />
                  ) : network.logo === "BscLogo" ? (
                    <BscLogo width="100%" height="100%" />
                  ) : network.logo === "EthLogo" ? (
                    <EthLogo width="100%" height="100%" />
                  ) : null}
                </div>
                <span className="sr-only">{network.name}</span>
              </button>
            );
          })}
        </div>



        {/* Page navigation buttons */}
        <div className="flex items-left justify-center ml-40">
          <div className="flex space-x-2">
            {/* {pages.map((page) => (
              <button
                key={page.id}
                className="flex items-center bg-dex-bg-tertiary hover:bg-dex-bg-highlight text-dex-text-primary rounded px-3 py-2 text-sm"
                onClick={() => {
                  let urlParam:string="";
                  if (page.id === "pump") {
                    urlParam = "/?tab=pump";
                  }else{
                    urlParam = `/?chain=${chainType}&tab=${page.id}`;
                  }
                  router.push(urlParam);}}
              >
                <span className="mr-1">{page.icon}</span>
                {page.name}
              </button>
            ))} */}
            {pages.map((page) => {
              const href =
                page.id === "pump"
                  ? "/?tab=pump"
                  // : `/?chain=${chainName}&tab=${page.id}`;
                  : `/?chain=${currentChain}&tab=${page.id}`; // ✅ 用 currentChain

              return (
                <Link
                  key={page.id}
                  href={href}
                  className="flex items-center bg-dex-bg-tertiary hover:bg-dex-bg-highlight text-dex-text-primary rounded px-3 py-2 text-sm"
                >
                  <span className="mr-1">{page.icon}</span>
                  {page.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sorting and filtering tools */}
        {/* 20250529，临时屏蔽 */}
        <div className="flex items-center">
          <SplTrendingFilterTools
            isFiltered={isFiltered}
            openFiltersModal={openFiltersModal}
            sortField={sortBy}
            onSortChange={onSortChange}
          />
        </div>
        {/* <CustomFilter
          // value={filter}
          // onChange={setFilter}
          value={}
          onChange={}
          trigger={
            <button className="btn btn-sm gap-2 rounded-2xl bg-base-200 hover:bg-base-300/90 border border-base-300/60">
              <FilterLine className="w-4 h-4" /> 自定义筛选
            </button>
          }
        /> */}
      </div>
    </div>
  );
};


