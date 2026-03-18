"use client";
import React, { MouseEvent } from "react";
import Image from "next/image";
// import { useRouter } from "next/router";      //pages/ 目录.CSR only（仅客户端）
// import { useRouter } from "next/navigation";  //App目录结构。支持 React 服务器组件架构（但 hook 只能用在客户端组件）
import { remoteImage } from "@/utils/remote_image";
import { Twitter } from "@/components/icons/medium/Twitter";
import { Telegram } from "@/components/icons/medium/Telegram";
import { WebSite } from "@/components/icons/medium/WebSite";
import { Pump } from "@/components/icons/dex/Pump";


import { formatNumber_fromInfo_v1 } from "@/utils/format/number";
import { shortenAddress } from "@/utils/format/chain";
import { formatPrice_fromInfo_v2 } from "@/utils/format/price";
import { TChainName, TQtType } from "@gr/interface-base";
import { IGrTokenSortItem_Client, } from "@gr/interface-api/uniform-data";
import {
    // formatTimeAgo_fromCommon_v2, 
    formatTimeAgo_useSeconds_v2,
} from "@/utils/format/time";
import Link from "next/link";
// import { TThemeColorScheme } from "@/config/theme_language_constants";
import { TokenFavoriteDialog } from "@/components/Radix/Favorite/TokenFavoriteDialog/Page";
import { HoverTokenCard } from "@/components/Radix/Hover/HoverTokenCard/Page";
import { LiveTimeAgo } from "@/components/Common/LiveTimeAgo/Page";
// import { mathParseFloat_Fixed2 } from "@gr/utils";
// import { remoteImage } from "@/unit/remote_image";
interface TokenRowProps {
    chainName: TChainName;
    qtType: TQtType;
    // token: TrendingToken;
    // token: ISolSplTokenItem;
    token: IGrTokenSortItem_Client;
    rank: number;
    // theme_color_scheme: TThemeColorScheme;

    // onOpenDialog: (tokenAddress: string) => void;   // 收藏对话框控制：打开时调用，传入 tokenAddress
    /** 收藏点击：点击星星时触发，传入事件对象和 token 地址 */
    /* onFavoriteClick: (
        e: React.MouseEvent<HTMLElement>,
        tokenAddress: string
    ) => void; */
    // isDialogOpen: boolean;      // 当前是否打开对话框
    // dialogTokenAddress: string | null;  // 当前对话框选中的 tokenAddress
    // 新增 👇
    onManageGroup: () => void;
    favoritedTokenSet: Set<string>;     //收藏的 Token Set    

    // onToggleFavorite: (tokenAddress: string) => void;  // 切换收藏状态的回调函数
    // onAddToGroup: (tokenAddress: string, groupId: string) => void;  // 添加到收藏分组的回调
    // onRemoveFromGroup: (tokenAddress: string, groupId: string) => void; // 从收藏分组中移除的回调
    // selectedGroupIds: string[];           // 当前选择的收藏分组 ID 列表
    // onManageGroup: () => void;            // 管理分组的回调
}

interface PriceChangeCellProps {
    value?: number;
}

interface Top10PercentCellProps {
    value?: number;
}

interface YesOrNoCellProps {
    value?: number;
    active: number;
}

export const TrendingRow = ({
    chainName,
    qtType,
    token,
    rank,
    // theme_color_scheme,

    // onOpenDialog,         //  打开收藏对话框的回调
    // onFavoriteClick,
    // isDialogOpen,         //  当前是否打开对话框
    // dialogTokenAddress,   //  当前选中的 tokenAddress
    // 新增 👇
    onManageGroup,
    favoritedTokenSet,    //  收藏的 Token Set

    // onToggleFavorite,      // 切换收藏状态的回调函数
    // onAddToGroup,          // 添加到收藏分组的回调
    // onRemoveFromGroup,     // 从收藏分组中移除的回调
    // selectedGroupIds,      // 当前选择的收藏分组 ID 列表
    // onManageGroup,         // 管理分组的回调
}: TokenRowProps) => {
    /* 
        在 app/ 目录中使用 next/navigation 的 useRouter() 后，它的 router.push() 只能接收一个字符串路径，不支持对象形式 { pathname, query } 的导航方式（这是 next/router 才支持的）。
         */
    /* router.push({
        // pathname: `/${getApiChainId(token.chainId)}/${token.tokenAddress}`,
        pathname: `/${getApiChainId(chainId)}/${token.address}`,
        query: {
            symbol: token.symbol,
        },
    }); */
    /* const handleTokenClick = () => {
        
        // 使用：next/navigation 后，需要手动构造带 query 的 URL 字符串
        const pathname = `/${getApiChainId(chainType)}/${token.ca}`;
        const symbol = encodeURIComponent(token.symbol);

        router.push(`${pathname}?symbol=${symbol}`);
    }; */

    /* let imgUrl: string = "";
    if (token.icon) {
        imgUrl = `http://54.175.45.26:3586/api/image?url=${encodeURIComponent(token.icon)}`
    } else {
        imgUrl = "/images/tokens/default-token.svg"
    } */
    // ✅ 这里可以基于 isDialogOpen 和 dialogTokenAddress 控制样式或状态

    /* const handleFavoriteClick = () => {
        onOpenDialog(token.ca); // ⬅️ 传当前 token 的地址，触发对话框
    }; */

    console.log("token.vol[5m]=", token.vol['5m']);
    console.log("token.vol[1h]=", token.vol['1h']);
    console.log("qtType=", qtType);

    /* const trHoverClass = theme_color_scheme === 'dark'
        //   ? 'hover:bg-[rgba(255,255,255,0.1)]'
        ? 'hover:bg-neutral hover:border hover:border-neutral-content/10'
        // ? 'hover:bg-base-100/20 hover:border hover:border-neutral-content/10'
        : 'hover:bg-neutral/10 hover:border hover:border-neutral-content/20'; // 更深一点，适配亮色系 */


    // const rowClassName = `cursor-pointer border border-transparent  ${trHoverClass} transition-colors duration-200 h-14`;

    // 在 SplTrendingRow 内判断收藏状态
    const isFavorited = favoritedTokenSet.has(token.ca);

    const now = Math.floor(Date.now() / 1000);
    const diff = now - token.c_t_sec;
    // const rowClassName = `cursor-pointer ${trHoverClass} transition-all duration-200 transform hover:scale-[1.01] h-14`;
    return (
        <tr
            // onClick={handleTokenClick}
            className="gr-trending-row"
        >
            {/* #/收藏 */}
            <th className="">

                <TokenFavoriteDialog
                    tokenAddress={token.ca}
                    chainName={chainName}
                    isFavorited={isFavorited}
                    /* onManageGroup={() => {
                        setEditDialogOpen(true);
                    }} */
                    onManageGroup={onManageGroup} // 👈 正确传入
                />

                {rank}
            </th>

            {/* 头像 */}
            <td className="px-4 py-3">
                <div
                    className="flex items-center gap-3"
                    // className="flex items-center gap-3"
                    onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                >
                    <HoverTokenCard token={token}>
                        {/* <div className="flex items-center gap-3"> */}
                        <div className="avatar">
                            <div className="mask mask-squircle h-10 w-10">
                                <Link href={`/${chainName}/token/${token.ca}`}>
                                    {/* <Image */}
                                    <Image
                                        // src={token.logo || "/images/tokens/default-token.svg"}
                                        // src={imgUrl || "/images/tokens/default-token.svg"}
                                        // src={remoteImage(token.image_url) || "/images/tokens/default-token.svg"}
                                        src={remoteImage(token.image_url) || `/images/${chainName}.svg`}
                                        alt={token.symbol}
                                        width={40} height={40}
                                        // className="w-8 h-8 rounded-full mr-3 bg-dex-bg-tertiary"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src =
                                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
                                        }}
                                    />
                                </Link>
                            </div>
                        </div>
                    </HoverTokenCard>
                </div>
            </td>
            {/* 第一行：币名 */}
            {/* 第二行：合约地址、媒体 */}
            <td className="">
                <div>
                    <div className="">
                        {/* <span>{token.symbol}</span> */}
                        <div className="text-sm font-bold primary">
                            <Link href={`/${chainName}/token/${token.ca}`}>
                                {token.name}
                            </Link>
                        </div>
                        {/* 闪电?
                            {token.lightning && (
                                <span className="ml-2 text-yellow-400 text-xs">
                                    ⚡{token.lightning}
                                </span>
                            )} */}
                    </div>
                    <div className="flex flex-row text-xs text-dex-text-secondary">

                        <div className="text-gray-500">
                            <Link href={`/${chainName}/token/${token.ca}`}>
                                {shortenAddress(token.ca)}
                            </Link>
                        </div>
                        {token.other_state.is_has_links && (
                            <div className="badge badge-ghost badge-sm">
                                {/* <span className="badge badge-ghost badge-sm"> */}
                                {(token.chain === "sol" && token.spl_safe!.is_pump === 1) && (
                                    <>
                                        <Link href={`https://pump.fun/coin/${token.ca}`} target='_blank'>
                                            <Pump width={32} height={32} />
                                        </Link>&nbsp;
                                    </>
                                )}
                                {(token.meta.x !== undefined && token.meta.x !== "") && (
                                    <>
                                        <Link href={token.meta.x} target='_blank'><Twitter /></Link>&nbsp;
                                    </>
                                )}
                                {(token.meta.site !== undefined && token.meta.site !== "") && (
                                    <>
                                        <Link href={token.meta.site} target='_blank'><WebSite /></Link>&nbsp;
                                    </>
                                )}
                                {(token.meta.tg !== undefined && token.meta.tg !== "") && (
                                    <>
                                        <Link href={token.meta.tg} target='_blank'><Telegram /></Link>&nbsp;
                                    </>
                                )}
                                {/* </span> */}
                            </div>
                        )}

                        {/* {token.name} */}
                    </div>
                </div>
            </td>
            {/* 流通市值/价格 */}
            {/* <td className="px-4 py-3 text-right">${formatPrice_v2(token.usdPrice)}</td> */}
            {/* <td className="px-4 py-3 text-right">${formatPrice_v2(token.price)}</td> */}
            <td className="">
                <div>
                    <div className="">
                        <div className="text-sm font-bold primary">
                            <Link href={`/${chainName}/token/${token.ca}`}>
                                ${formatNumber_fromInfo_v1(token.cmc ?? 0)}
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-row text-xs text-dex-text-secondary">
                        <div className="text-gray-500">
                            <Link href={`/${chainName}/token/${token.ca}`}>
                                {formatPrice_fromInfo_v2(token.price)}
                            </Link>
                        </div>
                    </div>
                </div>
            </td>

            {/* 时间 */}

            <td className="">
                <Link href={`/${chainName}/token/${token.ca}`}>
                    {diff < 86400 ? (
                        <LiveTimeAgo
                            seconds={token.c_t_sec}
                            // 上线时间在:1小时-24小时的，每5秒刷新一次；
                            // 在 24 小时内，每1秒刷新一次
                            tickSeconds={diff < 3600 ? 1 : 5}
                        />
                    ) : (
                        formatTimeAgo_useSeconds_v2(token.c_t_sec)
                    )}
                </Link>
            </td>

            {/* 5m/1h/6h/24h 交易额 */}
            <td className="">
                {/* ${formatNumber_fromInfo(getNestedValue(token, "volume_usd_1h", 0))} */}
                <div className="primary">
                    <Link href={`/${chainName}/token/${token.ca}`}>
                        ${formatNumber_fromInfo_v1(token.lv_0_hot_vol[qtType] ?? 0)}/${formatNumber_fromInfo_v1(token.vol[qtType] ?? 0)}
                    </Link>
                </div>
                <div className="text-[11px] flex flex-row text-gray-500">
                    <span>{token.lv_0_formula[qtType] ?? ""}</span>
                </div>
                <div className="text-[11px] flex flex-row text-gray-500">
                    <span>{token.lv_1_formula[qtType] ?? ""}</span>
                </div>
            </td>
            {/* 5m/1h/6h/24h 交易数 */}
            <td className="">
                {/* {formatNumber_fromInfo(getNestedValue(token, "tranx_1h.all_trader", 0))} */}
                {/* ${formatNumber_fromInfo(token.tranx_1h.all_trader ?? 0)} */}
                <div className="text-left">
                    <div className="primary">
                        {(token.tranx[qtType].all_trader ?? 0).toLocaleString()}
                    </div>
                    <div className="text-[11px] flex flex-row">
                        <div className="gr-k-line-green">
                            {(token.tranx[qtType].buys ?? 0).toLocaleString()}
                        </div>
                        /
                        <div className="gr-k-line-red">
                            {(token.tranx[qtType].sells ?? 0).toLocaleString()}
                        </div>
                    </div>
                </div>
            </td>
            {/* 5m/1h/6h/24h 独立交易数 */}
            <td className="">
            <div className="text-left">
                    <div className="primary">
                        {(token.tranx[qtType].ind_trader ?? 0).toLocaleString()}
                    </div>

                    {/* <div className="text-[11px] flex flex-row">
                        <div className="gr-k-line-green">
                            {(token.tranx[qtType].buyers ?? 0).toLocaleString()}
                        </div>
                        /
                        <div className="gr-k-line-red">
                            {(token.tranx[qtType].sellers ?? 0).toLocaleString()}
                        </div>
                    </div> */}
                </div>
                
            </td>
            {/* 1h 涨跌幅*/}
            <td className="">
                {/* {formatNumber_fromInfo(getNestedValue(token, "price_change.h1", 0))} */}
                <PriceChangeCell value={token.price_change['1h']} />
            </td>
            {/* 24h 涨跌幅*/}
            <td className="">
                {/* {formatNumber_fromInfo(getNestedValue(token, "price_change.h24", 0))} */}
                <PriceChangeCell value={token.price_change['24h']} />
            </td>

            {/* <PriceChangeCell value={token.pricePercentChange?.["1h"]} />
            <PriceChangeCell value={token.pricePercentChange?.["4h"]} />
            <PriceChangeCell value={token.pricePercentChange?.["12h"]} />
            <PriceChangeCell value={token.pricePercentChange?.["24h"]} /> */}

            {/* 持有者 */}
            <td className="">
                {/* ${formatNumber(token.liquidityUsd)} */}
                {/* 流动性-改-持有地址数 */}
                {/* {token.holders.total} */}
                {/* {parseInt(token.holders.total)>100000?formatNumber_fromInfo(token.holders.total ?? 0):token.holders.total} */}
                {formatNumber_fromInfo_v1(token.holders.total ?? 0)}
            </td>

            {chainName === "sol" ?
                (
                    <>
                        <td>
                            <div className="text-left">
                                {/* <div className="text-xs text-gray-600">Mint丢弃</div> */}
                                <div className="text-xs text-gray-600">可增发</div>
                                <YesOrNoCell value={token.spl_safe?.is_mint_able} active={0} />
                            </div>
                        </td>
                        <td>
                            <div className="text-left">
                                <div className="text-xs text-gray-600">黑名单</div>
                                {/* <div>{token.spl_safe?.is_black_listed === 0 ? "否" : "是"}</div> */}
                                <YesOrNoCell value={token.spl_safe?.is_black_listed} active={0} />
                            </div>
                        </td>
                        <td>
                            <div className="text-left">
                                <div className="text-xs text-gray-600">??</div>
                                <div>??</div>
                            </div>
                        </td>
                        <td>
                            <div className="text-left">
                                <div className="text-xs text-gray-600">Top 10</div>
                                {/* <div>{token.holders.top10_percent === "0" ? "-" : token.holders.top10_percent}</div> */}
                                <Top10PercentCell value={token.holders.top_10_percent} />

                            </div>
                        </td>
                    </>
                ) : (
                    <>
                        <td>
                            <div className="text-left">
                                <div className="text-xs text-gray-600">貔貅</div>
                                {/* <div>{token.evm_safe?.is_scam}</div> */}
                                <YesOrNoCell value={token.evm_safe?.is_scam} active={0} />
                            </div>
                        </td>
                        <td>
                            <div className="text-left">
                                <div className="text-xs text-gray-600">开源</div>
                                {/* <div>{token.evm_safe?.is_open_source}</div> */}
                                <YesOrNoCell value={token.evm_safe?.is_open_source} active={1} />
                            </div>
                        </td>
                        <td>
                            <div className="text-left">
                                <div className="text-xs text-gray-600">弃权</div>
                                {/* <div>{token.evm_safe?.is_ownership_renounced}</div> */}
                                <YesOrNoCell value={token.evm_safe?.is_ownership_renounced} active={1} />
                            </div>
                        </td>
                        <td>
                            <div className="text-left">
                                <div className="text-xs text-gray-600">锁池子</div>
                                {/* <div>{token.evm_safe?.is_lp_locked}</div> */}
                                <YesOrNoCell value={token.evm_safe?.is_lp_locked} active={1} />
                            </div>
                        </td>
                        <td className="px-4 py-3 text-left">
                            <div className="text-xs text-gray-600">
                                {token.evm_safe?.buy_tax}/
                                {token.evm_safe?.sell_tax}&nbsp;%
                            </div>
                        </td>
                    </>
                )
            }

            {/* <td className="px-4 py-3 text-right">${formatNumber(token.marketCap)}</td> */}
            <td className="">
                {/* ${formatNumber_fromInfo(token.market_cap_usd)} */}
                op
            </td>
        </tr>
    );
};

const PriceChangeCell = ({ value }: PriceChangeCellProps) => {
    const isPositive = value !== undefined && value >= 0;
    return (
        <td
            className={`py-3 text-left ${isPositive ? "gr-k-line-green" : "gr-k-line-red"
                /* className={`px-4 py-3 text-right ${isPositive ? "green" : "red" */
                }`}
        >
            {typeof value === "number"
                /* ? `${isPositive ? "+" : ""}${(value * 100).toFixed(2)}%` */
                ? `${isPositive ? "+" : ""}${value.toFixed(1)}%`
                : "-"}
        </td>
    );
};

const Top10PercentCell = ({ value }: Top10PercentCellProps) => {
    const isGray = value === undefined || value === 0;
    const isPositive = value !== undefined && value < 30;
    let percentChar: string = "";
    if (!isGray) {
        percentChar = "%";
    }
    return (
        <div
            className={`text-[11px] 
                ${isGray ? "text-gray-500" : isPositive ? "gr-k-line-green" : "gr-k-line-red"
                /* className={`px-4 py-3 text-right ${isPositive ? "green" : "red" */
                }`}
        >
            {typeof value === "number"
                /* ? `${isPositive ? "+" : ""}${(value * 100).toFixed(2)}%` */
                /* ? `${isGray ? "-" : (value * 100).toFixed(1)}${percentChar}` */
                ? `${isGray ? "-" : (value).toFixed(1)}${percentChar}`
                : "-"}
        </div>
    );
};

/**
 * 渲染“是/否”状态的表格单元格
 * 
 * 功能说明：
 * - 根据传入的 `value` 和 `active` 判断当前单元格的状态：
 *   1. 未定义值 (undefined) 或 -1 时，显示为灰色 "-"
 *   2. 值等于 `active` 时，显示为绿色（默认“是”）
 *   3. 值不等于 `active` 时，显示为红色（默认“否”）
 * - 当 `active` 为 0 时，反转“是/否”文字的含义：
 *   - 值等于 0 显示“否”
 *   - 值不等于 0 显示“是”
 * 
 * @param value  当前单元格的数值（number 或 undefined）
 * @param active 状态基准值（与 value 比较来决定是否为正向状态）
 */
const YesOrNoCell = ({ value, active }: YesOrNoCellProps) => {
    const isGray = value === undefined || value === -1;
    const isPositive = value !== undefined && value === active;
    let isPositiveStr: string = "是";
    let notPositiveStr: string = "否";
    if (active === 0) {
        isPositiveStr = "否";
        notPositiveStr = "是";
    }
    return (
        <div
            className={`text-[11px] 
                ${isGray ? "text-gray-500" : isPositive ? "gr-k-line-green" : "gr-k-line-red"
                /* className={`px-4 py-3 text-right ${isPositive ? "green" : "red" */
                }`}
        >
            {typeof value === "number" ?
                `${isGray ? "-" : isPositive ? isPositiveStr : notPositiveStr}`
                : "-"}
        </div>
    );
};
