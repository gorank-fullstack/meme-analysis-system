"use client";
import { useState, useRef, useEffect } from "react";

// import { useRouter } from "next/router";      //pages/ 目录.CSR only（仅客户端）
import { useRouter } from "next/navigation";  //App目录结构。支持 React 服务器组件架构（但 hook 只能用在客户端组件）
// import { useNavigate } from "react-router-dom";//来自：React Router（比如纯 React 项目，或 CRA 中使用）
import { PumpBondingToken } from "@/components/Pump/PumpBondingToken/Page";
import { PumpGraduatedToken } from "@/components/Pump/PumpGraduatedToken/Page";
import { PumpNewToken } from "@/components/Pump/PumpNewToken/Page";
import { formatPrice_fromCommon_V2 } from "@/utils/format/price";
import {  formatTimeAgo_fromCommon_v2 } from "@/utils/format/time";
import { formatNumber_fromInfo_v1 } from "@/utils/format/number";
import { getApiChainSimpleFromChainId } from "@/utils/format/chain";
import {
    //---- Pump New ----
    ISplPumpNewToken,
    ISplPumpNewTokenResponse,
    //---- Pump Bonding ----
    ISplPumpBondingToken,
    ISplPumpBondingTokenResponse,
    //---- Pump Bonding ----
    ISplPumpGraduatedToken,
    ISplPumpGraduatedTokenResponse,
// } from "@/interface/mo_spl"
} from "@gr/interface-api/platform-data"

const NEST_URL = process.env.NEXT_PUBLIC_NEST_API_HOST;

const pump_new_limit: string = "100";
const pump_bonding_limit: string = "100";
const pump_graduated_limit: string = "100";
// 2. Token 类型定义（你可以根据实际字段扩展）
/* type Token = {
    id: string;
    symbol: string;
    name: string;
    logo?: string | null;
    priceUsd: number;
    liquidity: number;
    fullyDilutedValuation: number;
    bondingCurveProgress?: number;
    graduatedAt?: string | number | Date;
    createdAt?: string | number | Date;
    isNew?: boolean;
}; */

/* type RawToken = {
    tokenAddress: string;
    symbol: string;
    name: string;
    logo?: string | null;
    priceUsd: number;
    liquidity: number;
    fullyDilutedValuation: number;
    createdAt?: string | number | Date;
    // ...可根据 API 增加字段
};
 */
// type NewTokenWithFlag = RawToken & {
type NewTokenWithFlag = ISplPumpNewToken & {
    isNew: boolean;
};

export const PumpFunPage = () => {
    const router = useRouter();
    // const navigate = useNavigate();  //仅纯react项目,中使用
    // 3. State hooks with proper typing
    // const [newTokens, setNewTokens] = useState<Token[]>([]);
    const [newTokens, setNewTokens] = useState<ISplPumpNewToken[]>([]);
    // const [bondingTokens, setBondingTokens] = useState<Token[]>([]);
    const [bondingTokens, setBondingTokens] = useState<ISplPumpBondingToken[]>([]);
    // const [graduatedTokens, setGraduatedTokens] = useState<Token[]>([]);
    const [graduatedTokens, setGraduatedTokens] = useState<ISplPumpGraduatedToken[]>([]);

    // 4. Loading & error states
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // 5. Type-safe Set
    const [newTokensIds, setNewTokensIds] = useState<Set<string>>(new Set());

    // 6. useRef 类型：NodeJS.Timeout 适用于 setInterval/setTimeout 返回值
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);

    // pollingInterval: useRef<NodeJS.Timeout | null> 类型已经在之前定义
    // setLoading: (val: boolean) => void
    // setError: (val: string | null) => void

    const chainId = "solana";
    const chainSimple = getApiChainSimpleFromChainId(chainId);
    // const isSolana = chainId === "solana";

    useEffect(() => {
        fetchAllTokens();

        // 设置轮询：30秒拉一次数据
        pollingInterval.current = setInterval(fetchAllTokens, 30000);

        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, []);

    // 主加载函数，拉取三种 Token 数据
    const fetchAllTokens = async (): Promise<void> => {
        setLoading(true);

        try {
            await Promise.all([
                fetchNewTokens(),
                fetchBondingTokens(),
                fetchGraduatedTokens(),
            ]);
        } catch (err) {
            console.error("Error fetching pump.fun tokens:", err);
            // setError("Failed to load pump.fun tokens. Please try again.");
            // 设置错误时，使用 Error 实例而不是字符串
            setError(new Error("Failed to load pump.fun tokens. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    const fetchNewTokens = async (): Promise<void> => {
        try {
            const url = `${NEST_URL}/api-mo/${chainSimple}/pump_new/${pump_new_limit}`;
            // "https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/new?limit=100";
            const response = await fetch(url);
            /* const response = await fetch(url, {
                headers: {
                    accept: "application/json",
                    "X-API-Key": API_KEY,
                },
            }); */

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            // const data: { result: RawToken[] } = await response.json();
            // const data: { result: RawToken[] } = await response.json();
            const pumpNewTokenResponse: ISplPumpNewTokenResponse = await response.json();
            const pumpNewTokens: ISplPumpNewToken[] = pumpNewTokenResponse.result;

            /* const currentTokenIds = new Set<string>(
                newTokens.map((token) => token.tokenAddress)
            ); */
            // 
            const incomingTokens: ISplPumpNewToken[] = pumpNewTokens || [];

            // Previous known token IDs
            const previousTokenIds = new Set<string>(newTokensIds);

            // Update global token ID Set
            setNewTokensIds(
                new Set([
                    ...previousTokenIds,
                    ...incomingTokens.map((token) => token.tokenAddress),
                ])
            );

            // Detect brand new tokens not seen before
            const brandNewTokens = incomingTokens.filter(
                (token) => !previousTokenIds.has(token.tokenAddress)
            );

            const tokensWithFlag: NewTokenWithFlag[] = incomingTokens.map((token) => ({
                ...token,
                isNew: brandNewTokens.some(
                    (newToken) => newToken.tokenAddress === token.tokenAddress
                ),
            }));

            setNewTokens(tokensWithFlag);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Unknown error occurred";
            console.error("Error fetching new tokens:", message);
            throw err;
        }
    };

    const fetchBondingTokens = async (): Promise<void> => {
        try {
            const url = `${NEST_URL}/api-mo/${chainSimple}/pump_bonding/${pump_bonding_limit}`
            // "https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/bonding?limit=100";
            const response = await fetch(url);
            /* const response = await fetch(url, {
                headers: {
                    accept: "application/json",
                    "X-API-Key": API_KEY,
                },
            }); */

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            // const data: { result: RawToken[] } = await response.json();
            const pumpBondingTokenResponse: ISplPumpBondingTokenResponse = await response.json();
            const pumpBondingTokens: ISplPumpBondingToken[] = pumpBondingTokenResponse.result;

            // setBondingTokens(data.result || []);
            setBondingTokens(pumpBondingTokens || []);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Unknown error occurred";
            console.error("Error fetching bonding tokens:", message);
            throw err;
        }
    };

    const fetchGraduatedTokens = async (): Promise<void> => {
        try {
            const url = `${NEST_URL}/api-mo/${chainSimple}/pump_graduated/${pump_graduated_limit}`
            // "https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/graduated?limit=100";
            const response = await fetch(url);
            /* const response = await fetch(url, {
                headers: {
                    accept: "application/json",
                    "X-API-Key": API_KEY,
                },
            }); */

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            // const data: { result: RawToken[] } = await response.json();
            const pumpGraduatedTokenResponse: ISplPumpGraduatedTokenResponse = await response.json();
            const pumpGraduatedTokens: ISplPumpGraduatedToken[] = pumpGraduatedTokenResponse.result;

            // setGraduatedTokens(data.result || []);
            setGraduatedTokens(pumpGraduatedTokens || []);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Unknown error occurred";
            console.error("Error fetching graduated tokens:", message);
            throw err;
        }
    };

    // 纯React版,才使用:navigate
    /* const handleTokenClick = (token) => {
        navigate(`/solana/${token.tokenAddress}`);
    }; */
    const handleTokenClick = (token: { tokenAddress: string }) => {
        router.push(`/sol/token/${token.tokenAddress}`);
    };

    return (
        <div className="container px-4 py-8 !mx-auto">
            {loading &&
                newTokens.length === 0 &&
                bondingTokens.length === 0 &&
                graduatedTokens.length === 0 ? (
                <div className="flex !justify-center !items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                    {/* {error} */}
                    {error.message}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* New Tokens */}
                    <div className="space-y-4">
                        <div className="bg-dex-bg-secondary rounded-t-lg p-4 border-b-2 border-amber-300">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <span className="mr-2">🆕</span> {/* Newly Created Tokens */}新币对
                            </h2>
                        </div>

                        <div className="!space-y-4 max-h-[80vh] overflow-y-auto p-2">
                            {newTokens.length === 0 ? (
                                <div className="text-center py-10 text-dex-text-secondary">
                                    No new tokens available
                                </div>
                            ) : (
                                newTokens.map((token) => (
                                    <PumpNewToken
                                        key={token.tokenAddress}
                                        token={token}
                                        formatPrice={formatPrice_fromCommon_V2}
                                        formatNumber={formatNumber_fromInfo_v1}
                                        formatTimeAgo={formatTimeAgo_fromCommon_v2}
                                        onClick={() => handleTokenClick(token)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Bonding Tokens */}
                    <div className="space-y-4">
                        <div className="bg-dex-bg-secondary rounded-t-lg p-4 border-b-2 border-amber-600">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <span className="mr-2">⚡</span> {/* Bonding Tokens */}即将迁移
                            </h2>
                        </div>

                        <div className="!space-y-4 max-h-[80vh] overflow-y-auto p-2">
                            {bondingTokens.length === 0 ? (
                                <div className="text-center py-10 text-dex-text-secondary">
                                    No bonding tokens available
                                </div>
                            ) : (
                                bondingTokens.map((token) => (
                                    <PumpBondingToken
                                        key={token.tokenAddress}
                                        token={token}
                                        formatPrice={formatPrice_fromCommon_V2}
                                        formatNumber={formatNumber_fromInfo_v1}
                                        onClick={() => handleTokenClick(token)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Graduated Tokens */}
                    <div className="space-y-4">
                        <div className="bg-dex-bg-secondary rounded-t-lg p-4 border-b-2 border-pink-500">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <span className="mr-2">🎓</span> {/* Graduated Tokens */}已迁移
                            </h2>
                        </div>

                        <div className="!space-y-4 max-h-[80vh] overflow-y-auto p-2">
                            {graduatedTokens.length === 0 ? (
                                <div className="text-center py-10 text-dex-text-secondary">
                                    No graduated tokens available
                                </div>
                            ) : (
                                graduatedTokens.map((token) => (
                                    <PumpGraduatedToken
                                        key={token.tokenAddress}
                                        token={token}
                                        formatPrice={formatPrice_fromCommon_V2}
                                        formatNumber={formatNumber_fromInfo_v1}
                                        formatTimeAgo={formatTimeAgo_fromCommon_v2}
                                        onClick={() => handleTokenClick(token)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};