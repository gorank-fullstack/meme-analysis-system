"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
// import { useParams } from "react-router-dom";

// import { ISolSplTokenItem, ISolSplTokenListResponse } from "@/interface/sol_spl";
// import { ISolSplTokenItem } from "@gr/interface";
import {
    TChainName, TQtType,
    TTabType_Server, TTabType_Client
} from "@gr/interface-base";

import {
    IGrTokenSortItem_Client,
} from "@gr/interface-api/uniform-data";
import { getClientToServerTab } from "@/interface/path";
import { TrendingTable } from "../TrendingTable/Page";
import { getTrendingTokens_v2 } from "@/utils/api_sol_spl";
// import { PATH_TO_CHAIN_ID } from "@/format/chain";
import { TrendingTopBar } from "@/components/Trending/TrendingTopBar/Page";
import { TrendingTimeSelector } from "@/components/Trending/TrendingTimeSelector/Page";
import { FiltersModal } from "@/components/modals/FiltersModal/Page";
// import { FavoriteDialog } from '@/components/Favorite/FavoriteDialog/Page';
// import { FavoriteSelectDialog } from '@/components/Favorite/FavoriteSelectDialog/Page';
import { getApiChainId } from "@/utils/format/chain";
import { TrendingPagination } from "../TrendingPagination/Page";
// import { getDomAnchorPosition_Offset } from "@/utils/ui/getDomAnchorPosition";
import { ManageGroupDialog } from "@/components/Radix/Favorite/ManageGroupDialog/Page";

// 你需要为 token 定义接口（示例，按你的实际结构可再扩展）
/* interface Token {
    address: string;
    name: string;
    symbol: string;
    decimals?: number;
    [key: string]: any;
  } */
// Map URL path segments to chain IDs for API
/* const PATH_TO_CHAIN_ID = {
    ethereum: "0x1",
    binance: "0x38",
    bsc: "0x38", // Alternative name
    polygon: "0x89",
    solana: "solana",
    arbitrum: "0xa4b1",
    base: "0x2105",
    avalanche: "0xa86a",
    optimism: "0xa",
    linea: "0xe708",
    fantom: "0xfa",
    pulse: "0x171",
    ronin: "0x7e4",
}; */
// 路由参数类型（Next.js 13 App Router）
/* type Params = {
    chainId?: string;
}; */


interface ISplTrendingPageProps {
    // activeTab: string;
    // onChange: (tabId: string) => void;
    chainName: TChainName;
    tabType_Client: TTabType_Client;
    qtType: TQtType,
}

// const NEST_URL = process.env.NEXT_PUBLIC_NEST_API_HOST;

export const TrendingPage = ({ chainName, tabType_Client, qtType }: ISplTrendingPageProps) => {
    // const { chainId } = useParams() as Params;
    // console.log('chainId=',chainId);
    // const [tokens, setTokens] = useState<ISolSplTokenItem[]>([]);
    const tabType_Server: TTabType_Server = getClientToServerTab(tabType_Client); // "hot"->"trending_pools";"new"->"new_pools";

    const [tokens, setTokens] = useState<IGrTokenSortItem_Client[]>([]);

    // 用于判断是否加载中。
    const [loading, setLoading] = useState<boolean>(true);
    // 用于判断是否是第一次加载，传给TrendingTable，在定时刷新时，减少对用户的干搅
    const [isFirstLoad, setFirstLoad] = useState(true);

    // 定时器引用--useRef 类型：NodeJS.Timeout 适用于 setInterval/setTimeout 返回值
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);

    

    // 排序
    const [sortField, setSortField] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // 过滤
    const [isFiltersModalOpen, setFiltersModalOpen] = useState<boolean>(false);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    // 分页
    const [currentPage, setCurrentPage] = useState(1); // ⬅️ 当前页码
    const [totalPages, setTotalPages] = useState(1); // ⬅️ 总页数

    // 收藏对话框：打开/关闭的状态，及选中的token地址
    // 原来的收藏弹窗控制状态（现在废弃）
    // const [isDialogOpen, setDialogOpen] = useState(false);

    // 新的“管理分组弹窗”控制状态
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    // 已废弃：统一控制 token 弹窗的地址
    // const [dialogTokenAddress, setDialogTokenAddress] = useState<string | null>(null);

    // 鼠标点击时：鼠标所在的组件的位置
    // 已废弃：后续 dom 元素定位版本（也不需要了）
    // const [domAnchorPos, setDomAnchorPos] = useState<{ x: number; y: number } | null>(null);

    // 当前链的收藏 token map
    const favoriteTokenMap = useSelector((state: RootState) => state.favoriteToken[chainName]);

    // 可选优化：提前生成 Set 用于快速查找
    /* 
    每行渲染时传 favoritedTokenSet，性能会不会受影响？
🧠 React 中的 props 传递，并不会拷贝整个对象
    即使你写了 100 行 <SplTrendingRow ... favoritedTokenSet={favoritedTokenSet} />，
    这些组件 引用的是同一个 Set 实例，只是把指针传下去而已（O(1））。

    ✔ 所以：
        ❝ 每一行渲染都会“接收一次” favoritedTokenSet，但这是同一个引用，不会复制，不会重复计算，不会有性能问题。 ❞

    什么时候可能造成 性能浪费？
    如果你没有用 useMemo，每次渲染时都创建了新的 Set：
        // ❌ 错误：每次组件渲染都会创建一个新 Set
        const favoritedTokenSet = new Set(Object.keys(favoriteTokenMap));
     */
    const favoritedTokenSet = useMemo(() => {
        return new Set(Object.keys(favoriteTokenMap));

        // 当且仅当 favoriteTokenMap 变更时，favoritedTokenSet 才会变。
    }, [favoriteTokenMap]);



    // const totalPages = 24; // 假设总共 24 页
    // let totalPages = 1;

    // 这个：handleFavoriteClick 是为 手动定位弹窗 + 全局控制弹窗状态 服务的，已经被全新方案替代
    /* const handleFavoriteClick = (
        e: React.MouseEvent<HTMLElement>,
        tokenAddress: string
    ) => {
        // 坐标依据：绑定事件的 DOM 元素位置（例如按钮左上角）
        const rawPos = getDomAnchorPosition_Offset(e, 16 + 40 + 8, 12 + 40 + 8);
        // 你弹窗的实际宽高
        const pos = adjustAnchorPositionIfOutOfViewport(rawPos, 320, 240);
        // const pos =rawPos;
        setDialogTokenAddress(tokenAddress);
        setDomAnchorPos(pos);
        setDialogOpen(true);
    }; */



    const handleApplyFilters = (filteredTokens: IGrTokenSortItem_Client[]) => {
        setTokens(filteredTokens);
        setIsFiltered(true);
    };

    // 启用：定时轮询时的useEffect
    useEffect(() => {
        fetchTokens(); // ✅ 立即拉一次

        // 清除旧定时器，避免重复启动
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
        }

        // 设置定时器：每 30 秒拉一次
        pollingInterval.current = setInterval(() => {
            console.log("⏱️ 每30秒轮询拉取一次 fetchTokens()");
            fetchTokens();
        }, 30_000);

        // 清理定时器（组件卸载 或 依赖变化时）
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
                pollingInterval.current = null;
            }
        };
    }, [chainName, qtType, currentPage]);

    // 未启用：定时轮询时的useEffect
    /* useEffect(() => {
        // const start = performance.now();
        fetchTokens();
        // const end = performance.now();
        // console.log(`fetchTokens 执行时间: ${(end - start).toFixed(4)} 毫秒`);
    }, [chainType, qtType, currentPage]); */



    const fetchTokens = async (): Promise<void> => {
        /* 
        useCallback 会确保 fetchTokens 只有在其依赖变动时才重新创建，保证 useEffect 中依赖一致
         */
        // const fetchTokens = useCallback(async (): Promise<void> => {
        const start = performance.now();

        // 仅首次加载才显示 loading UI
        if (isFirstLoad) {
            setLoading(true);
        }
        // setLoading(true);
        try {
            // const apiChainId = chainType ? PATH_TO_CHAIN_ID[chainType as keyof typeof PATH_TO_CHAIN_ID] || chainType : "";
            const apiChainId = chainName ? getApiChainId(chainName) : "";

            console.log(`Fetching tokens for chain: ${apiChainId} (from URL: ${chainName})`);

            // const data: ISolSplTokenItem[] = await getTrendingTokens_v2(NEST_URL as string); // 你需要确保 getTrendingTokens 返回的是 Token[]
            // const data: IGrTokenSortItem_Client[] = await getTrendingTokens_v2(
            const { maxPage, list } = await getTrendingTokens_v2(
                chainName,
                tabType_Server,
                qtType,
                currentPage,
            ); // 你需要确保 getTrendingTokens 返回的是 Token[]

            //更新总页数
            // totalPages=maxPage;
            setTotalPages(maxPage);
            // const tokenListRes: ISolSplTokenListResponse = await getTrendingTokens_v2(NEST_URL as string); // 你需要确保 getTrendingTokens 返回的是 Token[]
            // const data: ISolSplTokenItem[] = tokenListRes.data;
            console.log("list===:", list);
            setTokens(list);
            const end = performance.now();
            console.log(`getTrendingTokens_v2 执行时间: ${(end - start).toFixed(4)} 毫秒`);
        } catch (error) {
            console.error("Error fetching tokens:", error);
            setTokens([]);
        } finally {
            // 仅首次加载后关闭 loading 状态
            if (isFirstLoad) {
                setLoading(false);
                setFirstLoad(false); // 标记不再是首次
            }
            // setLoading(false);

        }
        // }, [chainId, NEST_URL, setTokens, setLoading]); // 依赖列表完整列出
    }
    /* , [chainId]); // 依赖列表完整列出 */

    /* useEffect(() => {
        fetchTokens();
        // useEffect 中只依赖 fetchTokens，保持 Hook 顺序正确，避免 ESLint 警告
        }, [fetchTokens]); // ✅ 只依赖 memoized 的函数
    // }, []); // ✅ 只依赖 memoized 的函数 */

    const handleSortChange = (column: string): void => {
        if (sortField === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(column);
            setSortOrder("desc");
        }
    };

    console.log(`isEditDialogOpen=${isEditDialogOpen}`);
    return (

        <div className="flex flex-col h-full">

            <TrendingTopBar
                chainName={chainName}
                isFiltered={isFiltered}
                openFiltersModal={() => setFiltersModalOpen(true)}
                sortBy={sortField}
                onSortChange={handleSortChange}
            />
            <TrendingTimeSelector
                chainName={chainName}
                tabType_Client={tabType_Client}
                qt={qtType}
            />
            <TrendingTable
                chainName={chainName}
                qtType={qtType}
                tokens={tokens}
                loading={loading}
                isFirstLoad={isFirstLoad}
                sortField={sortField}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                // 收藏对话框
                /* onOpenDialog={(address) => {
                    setDialogTokenAddress(address);
                    setDialogOpen(true);
                }} */
                // onFavoriteClick={handleFavoriteClick} // 👈 新增传参
                // isDialogOpen={isDialogOpen}
                // dialogTokenAddress={dialogTokenAddress}
                // onManageGroup 传给 SplTrendingTable → 再传给 FavoriteSelectPopover
                onManageGroup={() => setEditDialogOpen(true)}
                favoritedTokenSet={favoritedTokenSet}
            />
            {/* {isDialogOpen && dialogTokenAddress && domAnchorPos && (
                <FavoriteSelectDialog
                    isOpen={isDialogOpen}
                    onClose={() => setDialogOpen(false)}
                    tokenAddress={dialogTokenAddress}
                    chainType={chainType}
                    anchorPos={domAnchorPos} // ✅ 关键新增参数
                    onManageGroup={() => {
                        console.log('打开“管理分组”弹窗');
                    }}
                />
            )} */}
            {isEditDialogOpen && (
                <ManageGroupDialog
                    chainName={chainName}
                    isOpen={isEditDialogOpen}
                    // 直接传给 FavoriteGroupEditDialog
                    onClose={() => setEditDialogOpen(false)}
                />
            )}

            <TrendingPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
            <FiltersModal
                isOpen={isFiltersModalOpen}
                onClose={() => setFiltersModalOpen(false)}
                onApplyFilters={handleApplyFilters}
            />

        </div>
    );



}