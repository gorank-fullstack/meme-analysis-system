"use client";
import React, { useState, useEffect, } from "react";

// import { IMoEvmTokenLinks, IMoEvmTokenPairStats, IMoEvmTokenMetadata, IMoEvmTokenPair } from "@/interface/mo_evm";
import {
    IMoEvmTokenLinks, IMoEvmTokenPairStats,
    // IMoEvmTokenMetadata, 
    // IMoEvmTokenMeta,
    IMoEvmTokenPair,
    IMoUnifiedTokenMeta
} from "@gr/interface-api/platform-data";

import { blockExplorers,shortenAddress,getApiChainSimpleFromChainId } from "@/utils/format/chain";
import {
    formatNumber_fromInfo_v1, 
    formatPercentChange, calculateRatio,
} from "@/utils/format/number";
import{formatPrice_fromInfo_v1,formatPrice_Token} from "@/utils/format/price";
    
    import{TimeFramePeriod,timeFrameMap,formatTimeAgo_fromIsoTime,ApiTimePeriod} from "@/utils/format/time";
// const NEST_URL = process.env.REACT_APP_NEST_API_HOST;
const NEST_URL = process.env.NEXT_PUBLIC_NEST_API_HOST;


/* const timeFrameMap = {
    "5m": "5min",
    "1h": "1h",
    "4h": "4h",
    "24h": "24h",
};
*/

// 定义默认链上Quote Token映射表
const defaultQuoteTokens = {
    "0x1": "ETH",
    "0x38": "BNB",
    "0x89": "MATIC",
    "0xa86a": "AVAX",
    "0xa": "OP",
    "0xa4b1": "ARB",
    "0x2105": "ETH",
    "0xe708": "ETH",
    "0xfa": "FTM",
    "0x171": "PULSE",
    "0x7e4": "RON",
    solana: "SOL",
} as const;

// 类型推导：key是上述所有的key，value是固定symbol字符串
type ChainIdKey = keyof typeof defaultQuoteTokens;
type QuoteSymbol = typeof defaultQuoteTokens[ChainIdKey]; // "ETH" | "BNB" | "MATIC" | ...

//   ------------------------------------------------------
/* interface Token {
    address: string;
    [key: string]: any;
} */

interface TokenInfoProps {
    // token: any;       // 可以根据你的实际类型细化，比如 `IToken`
    // pair: any;        // 同样可以细化，比如 `IPair`
    symbol: string;
    ca: string;
    tokenPair: IMoEvmTokenPair;
    // tokenMetadata: IMoEvmTokenMeta;
    tokenMetadata: IMoUnifiedTokenMeta;
    //   timeFrame: string;
    chainId: string;
}

// declare const pairStats: IMoEvmTokenPairStats | null;

interface TimePeriodData {
    priceChange: number;
    buys: number;
    sells: number;
    buyVolume: number;
    sellVolume: number;
    buyers: number;
    sellers: number;
    totalVolume: number;
}

// const TokenInfo = ({ token, pair,tokenMetadata, chainId }: TokenInfoProps) => {
const TokenInfo = ({ symbol, ca, tokenPair, tokenMetadata, chainId }: TokenInfoProps) => {
    const [pairStats, setPairStats] = useState<IMoEvmTokenPairStats | null>(null);

    /* const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); */
    // const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>("24h");
    // useState，selectedTimeFrame 类型变得精准
    const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFramePeriod>("24h");

    // const [scrollPosition, setScrollPosition] = useState<number>(0);




    const chainSimple = getApiChainSimpleFromChainId(chainId);
    const isSolana = chainId === "solana";
    // 组件内容...

    // 你的fetch token metadata的useEffect
    /* useEffect(() => {
        const fetchTokenMetadata = async (): Promise<void> => {
            if (!token || !token.address) return;

            try {
                let url = `${NEST_URL}/mo/${chainSimple}/token_metadata/${token.address}`;
                const response = await fetch(url);

                console.log('fetchTokenMetadata response.ok =', response.ok);

                

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                console.log("Token metadata response:", data);

                if (isSolana) {
                    setTokenMetadata(data as TokenMetadata);
                } else {
                    setTokenMetadata(
                        Array.isArray(data) && data.length > 0 ? (data[0] as TokenMetadata) : null
                    );
                }
            } catch (err: any) {
                console.error("Error fetching token metadata:", err);
                setError(err.message || "Failed to fetch token metadata");
            } finally {
                setLoading(false);
            }
        };

        fetchTokenMetadata();
    }, [token, chainId, isSolana]); */

    // Fetch pair stats
    useEffect(() => {
        const fetchPairStats = async () => {
            //   if (!pair || !pair.pairAddress) return;
            console.log("tokenPair=", tokenPair);
            console.log("ca=", ca);
            console.log("chainSimple=", chainSimple);
            if (!tokenPair || !ca) return;
            console.log("2222222");
            /* setLoading(true); */
            try {
                const url = `${NEST_URL}/api-mo/${chainSimple}/pair_stats/${tokenPair.pair_address}`
                const response = await fetch(url);
                console.log("url=", url);
                console.log('fetchTransactions response.ok=', response.ok);
                /* let url;
                const isSolana = chainId === "solana";
        
                if (isSolana) {
                  url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${pair.pairAddress}/stats`;
                } else {
                  url = `https://deep-index.moralis.io/api/v2.2/pairs/${pair.pairAddress}/stats?chain=${chainId}`;
                }
        
                console.log("Fetching pair stats from:", url);
        
                const response = await fetch(url, {
                  headers: {
                    accept: "application/json",
                    "X-API-Key": API_KEY,
                  },
                }); */

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data: IMoEvmTokenPairStats = await response.json();
                console.log("Pair stats response:", data);
                setPairStats(data);
            } catch (err) {
                console.error("Error fetching pair stats:", err);
                /* setError("Failed to load pair statistics"); */
            } finally {
                /* setLoading(false); */
            }
        };

        fetchPairStats();
    }, [tokenPair, chainId]);

    // 处理时间范围选择 (原：Handle time frame selection　)
    const handleTimeFrameChange = (timeFrame: TimeFramePeriod): void => {
        setSelectedTimeFrame(timeFrame);
    };

    // 最优写法
    const getTimePeriodData = (period: TimeFramePeriod): TimePeriodData => {
        const apiPeriod: ApiTimePeriod = timeFrameMap[period];

        if (!pairStats) {
            // console.log("pairStats is null");
            return {
                priceChange: 0,
                buys: 0,
                sells: 0,
                buyVolume: 0,
                sellVolume: 0,
                buyers: 0,
                sellers: 0,
                totalVolume: 0,
            };
        }

        return {
            priceChange: pairStats.pricePercentChange[apiPeriod] ?? 0,
            buys: pairStats.buys[apiPeriod] ?? 0,
            sells: pairStats.sells[apiPeriod] ?? 0,
            buyVolume: pairStats.buyVolume[apiPeriod] ?? 0,
            sellVolume: pairStats.sellVolume[apiPeriod] ?? 0,
            buyers: pairStats.buyers[apiPeriod] ?? 0,
            sellers: pairStats.sellers[apiPeriod] ?? 0,
            totalVolume: pairStats.totalVolume[apiPeriod] ?? 0,
        };
    };

    // 获取代币社交链接（原：Get token social links）
    const getTokenLinks = (): IMoEvmTokenLinks => {
        if (!tokenMetadata) {
            return {}; // 如果需要严格的话可以返回 {} as IMoEvmTokenLinks
        }
        return tokenMetadata.links ?? {};
    };

    //　获取市值或FDV (原：Get market cap or FDV)
    const getMarketCapOrFDV = (type: "fdv" | "market_cap" = "fdv"): number => {
        if (!tokenMetadata) {
            return 0;
        }

        // const isSolana = chainId === "solana";

        if (isSolana) {
            // Solana链，这里你的 tokenMetadata 是 IMoEvmTokenProfile，里面没有 fullyDilutedValue 字段！
            // 需要修正为 fully_diluted_valuation
            return parseFloat(tokenMetadata.fdv) || 0;
        } else {
            if (type === "market_cap") {
                return parseFloat(tokenMetadata.moEvm!.market_cap) || 0;
            } else {
                return (
                    parseFloat(tokenMetadata.fdv) ||
                    parseFloat(tokenMetadata.moEvm!.market_cap) ||
                    0
                );
            }
        }
    };

    // Get current time period data
    const currentPeriodData = getTimePeriodData(selectedTimeFrame);

    const handleCopy = (text: string): void => {
        if (!text) return;
        navigator.clipboard.writeText(text).catch((err) => {
            console.error("Failed to copy text: ", err);
        });
        // 可以在这里加 toast 提示（比如用 react-hot-toast）
    };

    /* if (!token || !pair) {
        return (
            <div className="p-4 text-dex-text-secondary">No token data available</div>
        );
    } */

    if (!tokenMetadata || !tokenPair) {
        return (
            <div className="p-4 text-dex-text-secondary">No tokenMetadata available</div>
        );
    }

    /* if (!tokenPair?.pair) { return <div>No token info available</div>; } */

    // 正式定义
    const quoteToken: QuoteSymbol = (() => {
        // const isSolana = chainId === "solana";
        if (isSolana) return "SOL";

        return (defaultQuoteTokens[chainId as ChainIdKey] ?? "ETH") as QuoteSymbol;
    })();

    // 1. Token价格和流动性
    const usdPrice: number = pairStats?.currentUsdPrice
        ? parseFloat(pairStats.currentUsdPrice)
        // : pair.usdPrice ?? 0;
        : tokenPair.usd_price ?? 0;

    const nativePrice: number = pairStats?.currentNativePrice
        ? parseFloat(pairStats.currentNativePrice)
        // : pair.nativePrice ?? 0;
        : 0;


    const totalLiquidity: number = pairStats?.totalLiquidityUsd
        ? parseFloat(pairStats.totalLiquidityUsd)
        // : pair.liquidityUsd ?? 0;
        : tokenPair.liquidity_usd ?? 0;

    // 2. 市值
    // const marketCap: number = getMarketCapOrFDV();

    // 3. Token链接
    const tokenLinks: IMoEvmTokenLinks = getTokenLinks();

    // 4. Token分类 (EVM only)
    /* const tokenCategories: string[] = !isSolana && tokenMetadata?.categories
        ? tokenMetadata.categories
        : []; */

    // 5. 创建时间
    const creationTime: string | null = pairStats?.pairCreated
        // ?? tokenMetadata?.created_at
        ?? null;

    // 获取区块浏览器URL（原：Get the block explorer URL）
    const getExplorerUrl = (address: string, type: "address" | "token" = "address"): string => {
        // const isSolana = chainId === "solana";
        const explorer: string = blockExplorers[chainId] ?? "";

        if (!explorer) return "#";

        const resourcePath = type === "token" ? "token" : (isSolana ? "account" : "address");

        return `${explorer}/${resourcePath}/${address}`;
    };

    // 获取总供应量和代币配对　(原：Get total supply and tokens in pair)
    /* const getTokenSupply = (): string => {
        // if (isSolana) {
        //     return tokenMetadata?.totalSupplyFormatted ?? "0";
        // } else {
        //     return tokenMetadata?.total_supply_formatted ?? "0";
        // }
        return tokenMetadata?.total_supply_formatted ?? "0";
    }; */

    const anotherTarget = tokenPair.pair.find(
        (t) => t.token_address.toLowerCase() !== ca.toLowerCase()
    );

    let hasMeta: boolean = false;
    // console.log('tokenLinks=', tokenLinks)
    if (tokenLinks.website || tokenLinks.twitter || tokenLinks.telegram
        || tokenLinks.discord || tokenLinks.moralis) {
        hasMeta = true;
    }

    return (
        <>
            {/* <div className="token-right flex flex-col"> */}
            {hasMeta && (
                <div className="token-right-item min-h-[50px] break-words whitespace-normal">
                    <span>媒体</span>
                    {tokenLinks.website && (
                        
                            <a
                                href={tokenLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-3 py-1.5 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-sm font-medium text-center"
                            >
                                Website
                            </a>
                        
                    )}
                    {tokenLinks.twitter && (
                        
                            <a
                                href={tokenLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-3 py-1.5 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-sm font-medium text-center"
                            >
                                Twitter
                            </a>
                        
                    )}
                    {tokenLinks.telegram && (
                        
                            <a
                                href={tokenLinks.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-3 py-1.5 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-sm font-medium text-center"
                            >
                                Telegram
                            </a>
                        
                    )}
                    {tokenLinks.discord && (
                        <a
                            href={tokenLinks.discord}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-3 py-1.5 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-sm font-medium text-center"
                        >
                            Discord
                        </a>
                    )}
                    {/* {tokenLinks.moralis && (
                        <a
                            href={tokenLinks.moralis}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-3 py-1.5 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-sm font-medium text-center"
                        >
                            Moralis
                        </a>
                    )} */}
                    {/* {!tokenLinks.telegram && !tokenLinks.discord && (
                            <a
                                href="#"
                                className="flex-1 px-3 py-1.5 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-sm font-medium text-center"
                            >
                                Telegram
                            </a>
                        )} */}
                </div>
            )}
            <div className="token-right-item h-[300px]">
                <span>行情</span>
                {/* Price Information */}
                <div className="grid grid-cols-2 p-3 border-b border-dex-border">
                    <div className="col-span-1">
                        <div className="text-xs text-dex-text-secondary mb-0.5">
                            PRICE USD
                        </div>
                        <div className="text-sm font-medium">{formatPrice_fromInfo_v1(usdPrice)}</div>
                    </div>
                    <div className="col-span-1">
                        <div className="text-xs text-dex-text-secondary mb-0.5">
                            PRICE {quoteToken}
                        </div>
                        <div className="text-sm font-medium">
                            {formatPrice_Token(nativePrice, quoteToken)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="token-right-item h-[200px]">
                <span>交易</span>

            </div>
            <div className="token-right-item h-[120px]">
                {/* <span>流动性</span> */}
                {/* Liquidity & Volume */}
                <div className="grid grid-cols-3 p-3 border-b border-dex-border">
                    <div className="col-span-1">
                        <div className="text-xs text-dex-text-secondary mb-0.5">
                            LIQUIDITY
                        </div>
                        <div className="text-xs font-medium flex items-center">
                            ${formatNumber_fromInfo_v1(totalLiquidity)}
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="text-xs text-dex-text-secondary mb-0.5">FDV</div>
                        <div className="text-xs font-medium">
                            ${formatNumber_fromInfo_v1(getMarketCapOrFDV("fdv"))}
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="text-xs text-dex-text-secondary mb-0.5">MKT CAP</div>
                        <div className="text-xs font-medium">
                            ${formatNumber_fromInfo_v1(getMarketCapOrFDV("market_cap"))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="token-right-item h-[400px]">
                {/* <span>网格统计</span> */}
                {/* 时间段切换 */}
                <div className="grid grid-cols-4 border-b border-dex-border">
                    {(["5m", "1h", "4h", "24h"] as const).map((period) => {
                        const periodData = getTimePeriodData(period);
                        const isActive = selectedTimeFrame === period;
                        // console.log('isActive=', isActive);

                        return (
                            <div
                                key={period}
                                // className={`col-span-1 p-2 text-center cursor-pointer ${isActive ? "bg-dex-bg-secondary" : ""
                                className={`col-span-1 p-2 text-center cursor-pointer ${isActive ? "bg-[rgba(255,255,255,0.2)]" : ""
                                    }`}
                                onClick={() => handleTimeFrameChange(period)}
                            >
                                <div className="text-xs text-dex-text-secondary mb-0.5">
                                    {period}
                                </div>
                                <div
                                    className={`text-sm font-medium ${periodData.priceChange >= 0
                                        ? "text-dex-green"
                                        : "text-dex-red"
                                        }`}
                                >
                                    {formatPercentChange(periodData.priceChange)}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* 统计网格部分（原：Stats grid section） */}
                <div className="grid grid-cols-3 border-b border-dex-border">
                    {/* TXNS section */}
                    <div className="col-span-1 border-r border-dex-border p-2">
                        <div className="text-xs text-dex-text-secondary mb-0.5">TXNS</div>
                        <div className="text-sm font-medium">
                            {formatNumber_fromInfo_v1(currentPeriodData.buys + currentPeriodData.sells)}
                        </div>
                    </div>

                    {/* BUYS section */}
                    <div className="col-span-2 p-2">
                        <div className="grid grid-cols-2">
                            <div className="col-span-1">
                                <div className="text-xs text-dex-text-secondary mb-0.5">BUYS</div>
                                <div className="text-xs">
                                    {formatNumber_fromInfo_v1(currentPeriodData.buys)}
                                </div>
                            </div>
                            <div className="col-span-1 text-right">
                                <div className="text-xs text-dex-text-secondary mb-0.5">
                                    SELLS
                                </div>
                                <div className="text-xs">
                                    {formatNumber_fromInfo_v1(currentPeriodData.sells)}
                                </div>
                            </div>
                        </div>
                        <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="flex h-full">
                                <div
                                    className="h-full bg-dex-green"
                                    style={{
                                        width: `${calculateRatio(
                                            currentPeriodData.buys,
                                            currentPeriodData.sells
                                        ) * 100
                                            }%`,
                                    }}
                                ></div>
                                <div
                                    className="h-full bg-dex-red"
                                    style={{
                                        width: `${calculateRatio(
                                            currentPeriodData.sells,
                                            currentPeriodData.buys
                                        ) * 100
                                            }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 数量（原：VOLUME section） */}
                <div className="grid grid-cols-3 border-b border-dex-border">
                    <div className="col-span-1 border-r border-dex-border p-2">
                        <div className="text-xs text-dex-text-secondary mb-0.5">VOLUME</div>
                        <div className="text-sm font-medium">
                            ${formatNumber_fromInfo_v1(currentPeriodData.totalVolume)}
                        </div>
                    </div>

                    <div className="col-span-2 p-2">
                        <div className="grid grid-cols-2">
                            <div className="col-span-1">
                                <div className="text-xs text-dex-text-secondary mb-0.5">
                                    BUY VOL
                                </div>
                                <div className="text-xs">
                                    ${formatNumber_fromInfo_v1(currentPeriodData.buyVolume)}
                                </div>
                            </div>
                            <div className="col-span-1 text-right">
                                <div className="text-xs text-dex-text-secondary mb-0.5">
                                    SELL VOL
                                </div>
                                <div className="text-xs">
                                    ${formatNumber_fromInfo_v1(currentPeriodData.sellVolume)}
                                </div>
                            </div>
                        </div>
                        <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="flex h-full">
                                <div
                                    className="h-full bg-dex-green"
                                    /* className="h-full bg-[#4CE666]" */
                                    style={{
                                        width: `${calculateRatio(
                                            currentPeriodData.buyVolume,
                                            currentPeriodData.sellVolume
                                        ) * 100
                                            }%`,
                                    }}
                                ></div>
                                <div
                                    className="h-full bg-dex-red"
                                    /* className="h-full bg-[#E64C4C]" */
                                    style={{
                                        width: `${calculateRatio(
                                            currentPeriodData.sellVolume,
                                            currentPeriodData.buyVolume
                                        ) * 100
                                            }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* TRADERS section */}
                <div className="grid grid-cols-3 border-b border-dex-border">
                    <div className="col-span-1 border-r border-dex-border p-2">
                        <div className="text-xs text-dex-text-secondary mb-0.5">TRADERS</div>
                        <div className="text-sm font-medium">
                            {formatNumber_fromInfo_v1(currentPeriodData.buyers + currentPeriodData.sellers)}
                        </div>
                    </div>

                    <div className="col-span-2 p-2">
                        <div className="grid grid-cols-2">
                            <div className="col-span-1">
                                <div className="text-xs text-dex-text-secondary mb-0.5">
                                    BUYERS
                                </div>
                                <div className="text-xs">
                                    {formatNumber_fromInfo_v1(currentPeriodData.buyers)}
                                </div>
                            </div>
                            <div className="col-span-1 text-right">
                                <div className="text-xs text-dex-text-secondary mb-0.5">
                                    SELLERS
                                </div>
                                <div className="text-xs">
                                    {formatNumber_fromInfo_v1(currentPeriodData.sellers)}
                                </div>
                            </div>
                        </div>
                        <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="flex h-full">
                                <div
                                    className="h-full bg-dex-green"
                                    style={{
                                        width: `${calculateRatio(
                                            currentPeriodData.buyers,
                                            currentPeriodData.sellers
                                        ) * 100
                                            }%`,
                                    }}
                                ></div>
                                <div
                                    className="h-full bg-dex-red"
                                    style={{
                                        width: `${calculateRatio(
                                            currentPeriodData.sellers,
                                            currentPeriodData.buyers
                                        ) * 100
                                            }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="token-right-item h-[200px]">
                <span>市场</span>

            </div>

            <div className="token-right-item h-[300px]">
                <span>池子/创建人</span>
                {/* Pair Details Section - Shows when scrolled down */}
                <div className="border-b border-dex-border">
                    {creationTime && (
                        <div className="p-2 border-b border-dex-border flex justify-between items-center">
                            <div className="text-xs text-dex-text-secondary">Pair created</div>
                            <div className="text-xs">{formatTimeAgo_fromIsoTime(creationTime)}</div>
                        </div>
                    )}

                    {/* Pooled Tokens */}
                    {tokenPair.pair && tokenPair.pair.length > 0 && (
                        <>
                            {tokenPair.pair.map((pairToken, index) => (
                                <div
                                    key={index}
                                    className="p-2 border-b border-dex-border flex justify-between items-center"
                                >
                                    <div className="text-xs text-dex-text-secondary">
                                        {/* Pooled {pairToken.tokenSymbol} */}
                                        Pooled {pairToken.token_symbol}
                                    </div>
                                    <div className="text-xs">
                                        {/* ${formatNumber(pairToken.liquidityUsd)} */}
                                        ${formatNumber_fromInfo_v1(pairToken.liquidity_usd)}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Pair Address with Copy and Explorer Link */}
                    <div className="p-2 border-b border-dex-border">
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-dex-text-secondary">Pair</div>
                            <div className="flex items-center space-x-1">
                                <span className="font-mono text-xs">
                                    {/* {shortenAddress(pair.pairAddress)} */}
                                    {shortenAddress(tokenPair.pair_address)}
                                </span>
                                <button
                                    // onClick={() => handleCopy(pair.pairAddress)}
                                    onClick={() => handleCopy(tokenPair.pair_address)}
                                    className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                                <a
                                    // href={getExplorerUrl(pair.pairAddress, "token")}
                                    href={getExplorerUrl(tokenPair.pair_address, "token")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
                                >
                                    EXP
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Token Address */}
                    <div className="p-2 border-b border-dex-border">
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-dex-text-secondary">
                                {symbol}
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="font-mono text-xs">
                                    {shortenAddress(ca)}
                                </span>
                                <button
                                    onClick={() => handleCopy(ca)}
                                    className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                                <a
                                    href={getExplorerUrl(ca, "token")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
                                >
                                    EXP
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quote Token Address */}

                    {
                        /* tokenPair.pair &&
                            tokenPair.pair.find(
                                (t) => t.token_address.toLowerCase() !== ca.toLowerCase()
                            )  */
                        anotherTarget
                        && (

                            <div className="p-2">
                                {

                                }
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-dex-text-secondary">
                                        {anotherTarget.token_symbol

                                            /* tokenPair.pair.find(
                                                (t) =>
                                                    t.token_address.toLowerCase() !==
                                                    ca.toLowerCase()
                                            )?.token_symbol */
                                        }
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="font-mono text-xs">
                                            {
                                                /* shortenAddress(
                                                    tokenPair.pair.find(
                                                        (t) =>
                                                            t.token_address.toLowerCase() !==
                                                            ca.toLowerCase()
                                                    )?.token_address
                                                ) */
                                                shortenAddress(anotherTarget.token_address)
                                            }
                                        </span>
                                        <button
                                            onClick={() =>
                                                /* handleCopy(
                                                  pair.pair.find(
                                                    (t) =>
                                                      t.tokenAddress.toLowerCase() !==
                                                      token.address.toLowerCase()
                                                  ).tokenAddress
                                                ) */
                                                handleCopy(anotherTarget.token_address)
                                            }
                                            className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect
                                                    x="9"
                                                    y="9"
                                                    width="13"
                                                    height="13"
                                                    rx="2"
                                                    ry="2"
                                                ></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                        </button>
                                        <a
                                            href={
                                                getExplorerUrl(
                                                    /* pair.pair.find(
                                                      (t) =>
                                                        t.tokenAddress.toLowerCase() !==
                                                        token.address.toLowerCase()
                                                    ).tokenAddress, */
                                                    anotherTarget.token_address,
                                                    "token"
                                                )
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded hover:bg-dex-bg-highlight"
                                        >
                                            EXP
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
            {/* </div> */}
            <div
                // ref={containerRef}
                // className="text-dex-text-primary h-full overflow-y-auto text-sm"
                className="text-dex-text-primary overflow-y-auto text-sm"
            >
                {/* Token Header */}
                <div className="p-3 border-b border-dex-border">
                    {/* <div className="flex items-center mb-2">
                    <img
                        src={
                            token.logo ||
                            tokenMetadata?.logo ||
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg=="
                        }
                        alt={token.symbol}
                        className="w-8 h-8 mr-2 rounded-full bg-dex-bg-tertiary"
                        onError={(e) => {
                            e.target.onError = null;
                            e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzM0Mzk0NyIvPjwvc3ZnPg==";
                        }}
                    />
                    <div>
                        <h1 className="text-lg font-bold flex items-center">
                            {tokenMetadata?.name || token.name}
                            <span className="ml-2 text-sm text-dex-text-secondary">
                                ({tokenMetadata?.symbol || token.symbol})
                            </span>
                        </h1>
                        <div className="text-sm text-dex-text-secondary">
                            {pair.pairLabel} on {pair.exchangeName}
                        </div>
                    </div>
                </div> */}

                    {/* Token Categories for EVM */}
                    {/* {tokenCategories && tokenCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 mb-2">
                        {tokenCategories.slice(0, 3).map((category, index) => (
                            <span
                                key={index}
                                className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded-full text-dex-text-secondary"
                            >
                                {category}
                            </span>
                        ))}
                        {tokenCategories.length > 3 && (
                            <span className="px-1.5 py-0.5 text-xs bg-dex-bg-tertiary rounded-full text-dex-text-secondary">
                                +{tokenCategories.length - 3} more
                            </span>
                        )}
                    </div>
                )} */}


                </div>


                {/* Action Buttons */}
                {/* <div className="p-3 grid grid-cols-2 gap-2">
                    <a
                        href={`https://twitter.com/intent/tweet?text=Check%20out%20${symbol
                            }%20on%20DEXScreener&url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-center items-center p-2 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-xs"
                    >
                        <span className="mr-1">🐦</span>
                        <span>Search on Twitter</span>
                    </a>

                    <button
                        className="flex justify-center items-center p-2 bg-dex-bg-tertiary hover:bg-dex-bg-highlight rounded-lg text-xs"
                        onClick={() => {
                            // Handle showing other pairs
                        }}
                    >
                        <span className="mr-1">🔍</span>
                        <span>Other pairs</span>
                    </button>
                </div> */}
            </div>
        </>
    );
};

export default TokenInfo;
