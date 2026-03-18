'use client';
import React, { useState, useEffect } from "react";
import {  getApiChainSimpleFromChainId } from "@/utils/format/chain";
import { ITokenCaProps } from "@/interface/iweb3";
// import { IMoEvmHolderInsights } from "@/interface/mo_evm";
import { IMoEvmHolderInsights } from "@gr/interface-api/platform-data";

import {
    // Chart as ChartJS,
    // ArcElement,
    // Tooltip as ChartTooltip,
    // Legend,
    ChartOptions,
    TooltipItem,
} from "chart.js";
// import { Doughnut } from "react-chartjs-2";
import { formatNumber_fromCommon, formatPercentage } from "@/utils/format/number";
import dynamic from "next/dynamic";

// 关闭SSR（服务端渲染）
const DoughnutChart = dynamic(() => import("@/components/Chart/DoughnutChart/Page"), {
    ssr: false,
});

// import type { ChartOptions, TooltipItem } from "chart.js";
const NEST_URL = process.env.NEXT_PUBLIC_NEST_API_HOST;
// export default function Page() {
export const EvmTokenHolderInsights = ({ ca, chainId }: ITokenCaProps) => {
    // const [insights, setInsights] = useState(null);
    const [insights, setInsights] = useState<IMoEvmHolderInsights | null>(null);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | Error | null>(null);

    const chainSimple = getApiChainSimpleFromChainId(chainId);
    const isSolana = chainId === "solana";
    useEffect(() => {
        const fetchHolderInsights = async (): Promise<void> => {
            setLoading(true);

            try {
                // 构造请求 URL（针对 Mo 平台）
                const url = `${NEST_URL}/api-mo/${chainSimple}/token_holder_insights/${ca}`;
                const response = await fetch(url);

                console.log("fetchHolderInsights response.ok=", response.ok);

                // 检查响应是否正常
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                // 解析 JSON 响应
                const data: IMoEvmHolderInsights = await response.json(); // 可替换成具体类型
                console.log("Holder insights response:", data);

                setInsights(data); // 保存数据到 state
            } catch (err) {
                console.error("Error fetching holder insights:", err);
                /* setError("Failed to load holder insights data"); */
            } finally {
                setLoading(false);
            }
        };

        fetchHolderInsights();
    }, [ca, chainId, isSolana]);

    // Prepare data for acquisition chart
    const prepareAcquisitionData = () => {
        if (!insights || !insights.holdersByAcquisition)
            return { labels: [], datasets: [] };

        const { swap, transfer, airdrop } = insights.holdersByAcquisition;

        return {
            labels: ["Swap", "Transfer", "Airdrop"],
            datasets: [
                {
                    data: [swap || 0, transfer || 0, airdrop || 0],
                    backgroundColor: [
                        "rgba(59, 130, 246, 0.8)",
                        "rgba(139, 92, 246, 0.8)",
                        "rgba(16, 185, 129, 0.8)",
                    ],
                    borderColor: [
                        "rgb(59, 130, 246)",
                        "rgb(139, 92, 246)",
                        "rgb(16, 185, 129)",
                    ],
                    borderWidth: 1,
                    hoverOffset: 4,
                },
            ],
        };
    };

    const acquisitionOptions: ChartOptions<"doughnut"> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "50%", // 环图中间空心部分
        plugins: {
            legend: {
                position: "right",
                labels: {
                    color: "#9ca3af", // 字体颜色
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<"doughnut">): string => {
                        const label = context.label || "";
                        const value = Number(context.raw); // context.raw 是 number|string
                        const total = context.dataset.data.reduce(
                            (a: number, b: number) => a + Number(b),
                            0
                        );
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${label}: ${formatNumber_fromCommon(value)} (${percentage}%)`;
                    },
                },
                backgroundColor: "#1f2937", // tooltip 背景色
                titleColor: "#f3f4f6",       // 标题颜色
                bodyColor: "#f3f4f6",        // 内容颜色
                borderColor: "#374151",
                borderWidth: 1,
                padding: 10,
            },
        },
    };

    if (isSolana) {
        return (
            <div className="p-4 text-center text-dex-text-secondary">
                Holder insights are not available for Solana tokens
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

    if (loading) {
        return (
            <div className="p-4 text-center text-dex-text-secondary">
                Loading holder insights...
            </div>
        );
    }

    /* if (error) {
      return (
        <div className="p-4 text-center text-dex-text-secondary">{error}</div>
      );
    } */

    if (!insights) {
        return (
            <div className="p-4 text-center text-dex-text-secondary">
                No holder insights available
            </div>
        );
    }

    const acquisitionData = prepareAcquisitionData();
    const totalHolders = insights.totalHolders || 0;

    // Calculate percentages for acquisition
    const { swap = 0, transfer = 0, airdrop = 0 } = insights.holdersByAcquisition || {};
    const swapPercent = totalHolders > 0 ? (swap / totalHolders) * 100 : 0;
    const transferPercent = totalHolders > 0 ? (transfer / totalHolders) * 100 : 0;
    const airdropPercent = totalHolders > 0 ? (airdrop / totalHolders) * 100 : 0;


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Holders Trend Card */}
            {/* <div className="bg-dex-bg-secondary rounded-lg p-4 border border-dex-border"> */}
            <div className="rounded-lg p-4 border border-dex-border">
                {/* <h3 className="text-lg font-semibold text-dex-text-primary mb-1"> */}
                <h3 className="text-lg font-semibold mb-1">
                    {/* Holders Trend */}
                    持有者趋势
                </h3>
                <p className="text-sm text-dex-text-secondary mb-4">
                    {/* Change in amount over time. */}
                    持有人数变化
                </p>

                <div className="space-y-4">
                    {insights.holderChange &&
                        Object.entries(insights.holderChange)
                            .sort((a, b) => {
                                const order = ["5min", "1h", "6h", "24h", "3d", "7d", "30d"];
                                return order.indexOf(a[0]) - order.indexOf(b[0]);
                            })
                            .map(([timeframe, data]) => (
                                <div
                                    key={timeframe}
                                    className="flex justify-between items-center border-b border-dex-border pb-2"
                                >
                                    <span className="uppercase font-medium">{timeframe}</span>
                                    <div className="flex items-center">
                                        <span
                                            className={`mr-2 ${data.change > 0
                                                ? "text-green-500"
                                                : data.change < 0
                                                    ? "text-red-500"
                                                    : "text-dex-text-secondary"
                                                }`}
                                        >
                                            {data.change > 0 ? "+" : ""}
                                            {formatNumber_fromCommon(data.change)}
                                        </span>
                                        <span
                                            className={`flex items-center ${data.changePercent > 0
                                                ? "text-green-500"
                                                : data.changePercent < 0
                                                    ? "text-red-500"
                                                    : "text-dex-text-secondary"
                                                }`}
                                        >
                                            {data.changePercent > 0 ? (
                                                <svg
                                                    className="w-3 h-3 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 15l7-7 7 7"
                                                    ></path>
                                                </svg>
                                            ) : data.changePercent < 0 ? (
                                                <svg
                                                    className="w-3 h-3 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 9l-7 7-7-7"
                                                    ></path>
                                                </svg>
                                            ) : null}
                                            {Math.abs(data.changePercent).toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                </div>
            </div>

            {/* Supply Distribution Card */}
            {/* <div className="bg-dex-bg-secondary rounded-lg p-4 border border-dex-border"> */}
            <div className="rounded-lg p-4 border border-dex-border">
                {/* <h3 className="text-lg font-semibold text-dex-text-primary mb-1"> */}
                <h3 className="text-lg font-semibold mb-1">
                    {/* Supply Distribution */}
                    总量分配
                </h3>
                <p className="text-sm text-dex-text-secondary mb-4">
                    {/* Total supply distribution among top holders. */}
                    Top地址持有占比
                </p>

                <div className="space-y-4 w-full">
                    {insights.holderSupply &&
                        Object.entries(insights.holderSupply).map(([tier, data]) => (
                            <div key={tier} className="flex flex-row mb-3">
                                {/* Top 10-500 */}
                                <div className="w-[110px] text-left mb-1">
                                    <span className="capitalize">
                                        {tier.replace("top", "Top ")}
                                    </span>

                                </div>
                                {/* vs进度条 */}
                                {/* <div className="w-full bg-dex-bg-primary rounded-full h-2.5"> */}
                                <div className="w-full bg-[#132a44] h-1.5 mt-2">
                                    <div
                                        /* className="bg-dex-blue h-2.5 rounded-full" */
                                        className="bg-[#2e628e] h-1.5"
                                        style={{ width: `${data.supplyPercent}%` }}
                                    ></div>
                                </div>
                                {/* Top 10-500 百分比 */}
                                <div className="w-[90px] text-right">
                                    <span>{data.supplyPercent}%</span>
                                </div>


                            </div>
                        ))}
                </div>
            </div>

            {/* Holders Acquisition Card */}
            {/* <div className="bg-dex-bg-secondary rounded-lg p-4 border border-dex-border"> */}
            <div className="rounded-lg p-4 border border-dex-border">
                {/* <h3 className="text-lg font-semibold text-dex-text-primary mb-1"> */}
                <h3 className="text-lg font-semibold mb-1">
                    {/* Holders Acquisition */}
                    持有者来源
                </h3>
                <p className="text-sm text-dex-text-secondary mb-4">
                    {/* Based on the wallet&apos;s first interaction. */}
                    基于钱包的首次交互
                </p>

                <div className="h-64 flex items-center justify-center">
                    {/* <Doughnut data={acquisitionData} options={acquisitionOptions} /> */}
                    <DoughnutChart data={acquisitionData} options={acquisitionOptions} />
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2 bg-blue-500"></span>
                        <span className="text-dex-text-primary">
                            Swap
                            {/* 交易 */}
                        </span>
                        <span className="ml-auto">{formatPercentage(swapPercent)}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2 bg-purple-500"></span>
                        <span className="text-dex-text-primary">
                            Transfer
                            {/* 转账 */}
                        </span>
                        <span className="ml-auto">{formatPercentage(transferPercent)}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                        <span className="text-dex-text-primary">
                            Airdrop
                            {/* 空投 */}
                        </span>
                        <span className="ml-auto">{formatPercentage(airdropPercent)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
