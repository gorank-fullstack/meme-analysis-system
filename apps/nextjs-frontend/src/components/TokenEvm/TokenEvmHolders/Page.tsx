'use client'; 
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { 
    // getApiChainId, 
    getApiChainSimpleFromChainId } from "@/utils/format/chain";
import { 
    // ITrans, ISplTokenTransProps, IApiResponse, IPairData, ITokenValue, 
    ITokenCaProps } from "@/interface/iweb3";
// import { IMoEvmHolderItem, IMoEvmHolderResponse } from "@/interface/mo_evm";
import { IMoEvmHolderItem, IMoEvmHolderResponse } from "@gr/interface-api/platform-data";

import { formatPercentage,formatNumber_fromInfo_v1} from "@/utils/format/number";
import { formatPrice_Usd } from "@/utils/format/price";
import {getWalletExplorerUrl,formatWalletAddress } from "@/utils/format/chain";
import { getEntityLogoPath } from "@/utils/format/path";


const NEST_URL = process.env.NEXT_PUBLIC_NEST_API_HOST;
export const TokenEvmHolders = ({ ca, chainId }: ITokenCaProps) => {
    // const [holders, setHolders] = useState([]);
    const [holders, setHolders] = useState<IMoEvmHolderItem[]>([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // const [error, setError] = useState<string | Error | null>(null);
    
    // const [tableHeight, setTableHeight] = useState(400); // Default height
    const tableHeight =400;
    // const [cursor, setCursor] = useState(null);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const tableRef = useRef(null);
    const resizeRef = useRef(null);
    // const startYRef = useRef(0);
    // const startHeightRef = useRef(0);

    const chainSimple = getApiChainSimpleFromChainId(chainId);
    const isSolana = chainId === "solana";

    useEffect(() => {
        if (ca && !isSolana) {
            fetchHolders(); // ✅ TypeScript 会自动推断类型
        }
    }, [ca, chainId]);

    const fetchHolders = async (nextCursor: string | null = null): Promise<void> => {
        // if (!token || !token.address || isSolana) return;
        if (!ca || isSolana) return;

        setLoading(true);

        try {
            // 基础 URL：根据链名和代币地址构建
            let url = `${NEST_URL}/api-mo/${chainSimple}/token_holders/${ca}`;

            // 如果传入了游标，拼接 cursor 参数（用于翻页）
            if (nextCursor) {
                url += `&cursor=${nextCursor}`;
            }

            console.log("Fetching holders from:", url);

            // 发起请求
            const response = await fetch(url);

            // 检查响应是否成功
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            // 解析响应数据
            const data: IMoEvmHolderResponse = await response.json();
            console.log("Holders response:", data);

            // 如果有有效数据
            if (data && data.result) {
                if (nextCursor) {
                    // 翻页时追加结果
                    setHolders((prev: IMoEvmHolderItem[]) => [...prev, ...data.result]);
                } else {
                    // 初始加载时直接设置
                    setHolders(data.result);
                }

                // 设置新的游标
                setCursor(data.cursor);

                // 如果还有更多数据（result 不为空且存在 cursor），设置 hasMore
                setHasMore(data.result.length > 0 && !!data.cursor);
            }
        } catch (err) {
            console.error("Error fetching holders:", err);
            /* setError("Failed to load holders data"); */
        } finally {
            // 加载完成，无论是否成功
            setLoading(false);
        }
    };

    // 分页加载下一批 token holders 的函数
    // 原：Load more holders
    const loadMore = (): void => {
        if (cursor && hasMore && !loading) {
            fetchHolders(cursor); // ✅ cursor 是 string 类型
        }
    };

    if (isSolana) {
        return (
            <div className="p-4 text-center text-dex-text-secondary">
                Holder data is not available for Solana tokens
            </div>
        );
    }

    if (!ca) {
        return (
            <div className="p-4 text-center text-dex-text-secondary">
                No token data available
            </div>
        );
    }

    if (loading && holders.length === 0) {
        return (
            <div className="p-4 text-center text-dex-text-secondary">
                Loading holders data...
            </div>
        );
    }

    /* if (error && holders.length === 0) {
        return (
            <div className="p-4 text-center text-dex-text-secondary">{error}</div>
        );
    } */
    if (holders.length === 0) {
        return (
            <div className="p-4 text-center text-dex-text-secondary">&quot;error:holders.length === 0&quot;</div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div
                /* className="overflow-auto border border-dex-border bg-dex-bg-primary" */
                className="overflow-auto border border-dex-border"
                style={{ height: `${tableHeight}px` }}
            >
                <table
                    ref={tableRef}
                    className="w-full text-sm text-left border-collapse"
                >
                    {/* <thead className="text-xs uppercase bg-dex-bg-secondary sticky top-0 z-10"> */}
                    <thead className="text-xs uppercase sticky top-0 z-10">
                        <tr className="border-b border-dex-border">
                            <th className="px-4 py-3 whitespace-nowrap">#</th>
                            <th className="px-4 py-3 whitespace-nowrap">
                                {/* WALLET */}
                                地址
                            </th>
                            <th className="px-4 py-3 whitespace-nowrap">
                                {/* ENTITY */}
                                实体
                            </th>
                            <th className="px-4 py-3 whitespace-nowrap">
                                {/* TYPE */}
                                类型
                            </th>
                            <th className="px-4 py-3 text-right whitespace-nowrap">
                                {/* BALANCE */}
                                余额
                            </th>
                            <th className="px-4 py-3 text-right whitespace-nowrap">
                                {/* VALUE (USD) */}
                                价值 (USD)
                            </th>
                            <th className="px-4 py-3 text-right whitespace-nowrap">
                                {/* % OF SUPPLY */}
                                占比
                            </th>
                            <th className="px-4 py-3 text-right whitespace-nowrap">
                                浏览器
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {holders.map((holder, index) => {
                            return (
                                <tr
                                    key={`${holder.owner_address}_${index}`}
                                    className="border-b border-dex-border hover:bg-dex-bg-secondary/50"
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <a
                                            href={getWalletExplorerUrl(holder.owner_address, chainId, isSolana)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-mono hover:text-dex-blue flex items-center"
                                        >
                                            <span className="bg-dex-bg-tertiary text-dex-text-primary px-1 rounded mr-1">
                                                {holder.is_contract ? "📄" : "👤"}
                                            </span>
                                            {formatWalletAddress(holder.owner_address)}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {holder.owner_address_label ? (
                                            <div className="flex items-center">
                                                {holder.entity_logo && (
                                                    <Image
                                                        src={getEntityLogoPath("/png/images",holder.entity_logo)}
                                                        alt={holder.entity || "Entity"}
                                                        width={16}
                                                        height={16}
                                                        className="w-4 h-4 mr-1 rounded-full"
                                                    />
                                                )}
                                                <span className="text-dex-text-primary">
                                                    {holder.owner_address_label}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-dex-text-secondary">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {holder.is_contract ? (
                                            <span className="bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded text-xs">
                                                Contract
                                            </span>
                                        ) : (
                                            <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded text-xs">
                                                Wallet
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap font-mono">
                                        {/* {formatNumber_fromCommon(holder.balance_formatted, 4)} */}
                                        {formatNumber_fromInfo_v1(holder.balance_formatted)}
                                        
                                    </td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        {formatPrice_Usd(holder.usd_value)}
                                    </td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        {formatPercentage(
                                            holder.percentage_relative_to_total_supply
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <a
                                            href={getWalletExplorerUrl(holder.owner_address, chainId, isSolana)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-dex-text-secondary hover:text-dex-blue"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Load more button */}
            {hasMore && (
                <div className="mt-2 text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-4 py-2 bg-dex-bg-secondary hover:bg-dex-blue/20 text-dex-text-primary rounded"
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}

            {/* Resize handle */}
            <div
                ref={resizeRef}
                className="h-2 bg-dex-bg-secondary hover:bg-dex-blue cursor-ns-resize flex items-center justify-center"
            >
                <div className="w-10 h-1 bg-gray-600 rounded-full"></div>
            </div>
        </div>
    );
}
