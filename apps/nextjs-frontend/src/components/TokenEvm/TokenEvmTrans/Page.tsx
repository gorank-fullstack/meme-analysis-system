'use client';
import { useEffect, useRef, useState } from "react";

import { getApiChainSimpleFromChainId } from "@/utils/format/chain";
// import {ITransaction, IToken, TokenTransProps, Transaction, IApiResponse, IPairData} from "@/interface/iweb3";
import {
    ITrans,
    // ISplTokenTransProps, 
    IApiResponse, IPairData, ITokenValue, IEvmTokenTransProps
} from "@/interface/iweb3";
import { formatWalletAddress } from "@/utils/format/chain";
import { getTransType_V2 } from "@/utils/format/format_common";
import { getWalletExplorerUrl, getExplorerUrl } from "@/utils/format/chain";
import { formatNumber_fromCommon,formatNumber_fromInfo_v2 } from "@/utils/format/number";
import { formatPrice_WithColor, formatValue_WithColor } from "@/utils/format/price";
import { formatTimeAgo_fromCommon_v2 } from "@/utils/format/time";
import { clientRefreshTime } from "@/time/refreshTime";

const NEST_URL = process.env.NEXT_PUBLIC_NEST_API_HOST;

//   export const TokenTrans: React.FC<TokenTransProps> = ({ pair, chainId }) => {
export const TokenEvmTrans = ({ tokenPair, chainId }: IEvmTokenTransProps) => {
    /* Gpt
    最重要的一句话：
    useState 一旦存非 null 类型的数据，就一定要显式声明泛型。否则就是后患无穷。

    在 React + TypeScript 里，useState 只要存数据，就一定要指定泛型（类型参数）！
    （存单个对象、数组、甚至 boolean 都要明确类型，养成习惯，项目越大越安全。）
     */
    // const [transactions, setTransactions] = useState([]);
    const [trans, setTrans] = useState<ITrans[]>([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | Error | null>(null);
    // const [cursor, setCursor] = useState(null);
    // const [cursor, setCursor] = useState<string | null>(null);

    const [newTransactionIds, setNewTransactionIds] = useState(new Set());
    // const [pairData, setPairData] = useState(null);
    const [pairData, setPairData] = useState<IPairData | null>(null);
    // const pollInterval = useRef(null);
    const pollInterval = useRef<NodeJS.Timeout | null>(null);

    const chainSimple = getApiChainSimpleFromChainId(chainId);
    const isSolana = chainId === "solana";

    // 在组件装载时设置轮询，并在卸载时进行清理
    // 原：Set up polling when component mounts and clean up on unmount
    useEffect(() => {
        fetchTransactions();

        // 为实时更新设置轮询间隔
        // 原：Set up polling interval for real-time updates
        // pollInterval.current = setInterval(fetchNewTransactions, 10000); // Poll every 10 seconds
        pollInterval.current = setInterval(fetchNewTransactions, clientRefreshTime.SOL_TOKEN_TRANS); // Poll every 10 seconds

        return () => {
            if (pollInterval.current) {
                clearInterval(pollInterval.current);
            }
        };
    }, [tokenPair, chainId]);

    // 获取初始交易
    // 原：Fetch initial transactions
    const fetchTransactions = async (): Promise<void> => {
        if (!tokenPair || !tokenPair.pair_address) return;

        // 设置加载中状态--告诉前端界面，开始加载了（比如可以转圈圈、显示 loading 提示）
        setLoading(true);

        try {
            const url = `${NEST_URL}/api-mo/${chainSimple}/pair_trans/${tokenPair.pair_address}`;
            const response = await fetch(url);

            console.log('fetchTransactions response.ok=', response.ok);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data: IApiResponse = await response.json();
            console.log("Transactions response:", data);

            if (data) {
                /* 
                把 data 里的 baseToken、quoteToken、pairLabel 提取出来，组装成一个 PairData。
                更新状态 setPairData。
                （注意：用了 as any，说明你在偷懒绕过了类型检查 😁，可以优化一下）
                 */
                const newPairData: IPairData = {
                    baseToken: data.baseToken || null,
                    quoteToken: data.quoteToken || null,
                    pairLabel: data.pairLabel || null,
                };

                setPairData(newPairData);
                // setPairData(newPairData as any);

                if (data.result) {
                    // setCursor(data.cursor || null);


                    // setTransactions(data.result);    //这样写的前提：非常确认 data.result 是数组，可以直接：
                    // setTrans(data.result ?? []);
                    setTrans(data.result);
                    // setTransactions(data.result as any);
                }
            }
        } catch (err) {
            console.error("Error fetching transactions:", err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to load transactions");
                // setError("Unknown error occurred");
            }

            // setError("Failed to load transactions");

            // setError("Failed to load transactions" as any);
        } finally {
            setLoading(false);
        }
    };

    // 获取新交易以进行实时更新
    // 原：Fetch new transactions for real-time updates
    const fetchNewTransactions = async (): Promise<void> => {
        if (!tokenPair || !tokenPair.pair_address) return;

        try {
            const url = `${NEST_URL}/mo/${chainSimple}/pair_trans/${tokenPair.pair_address}`;
            const response = await fetch(url);

            console.log('fetchNewTransactions response.ok=', response.ok);

            if (!response.ok) {
                console.error(`API error during polling: ${response.status}`);
                return;
            }

            const data: IApiResponse = await response.json();

            if (data && data.result && data.result.length > 0) {
                const currentTransactionIds = new Set(
                    /* 
                    这里把 transactions（已有的一组交易记录）里的每一条 transaction 的 transactionHash 提取出来，组成一个数组。
                    new Set(...)
                    然后用这个数组创建一个 Set（集合）。Set 会自动去重，保证里面的元素是唯一的。
                     */
                    trans.map((tx: ITrans) => tx.transactionHash)
                );

                /* 
                1：data.result 是接口返回的一批新的交易（数组）。
                2：用 .filter() 遍历每一条交易 tx。
                3：每一条 tx，检查它的 transactionHash。
                4：如果这个 transactionHash 不在 currentTransactionIds 这个集合里面（也就是说是新的交易），那就保留下来。
                5：最终 newTxs 就是所有之前没有的、全新的交易记录的数组！
                 */
                const newTxs = data.result.filter(
                    (tx: ITrans) => !currentTransactionIds.has(tx.transactionHash)
                );

                // 当发现有新的交易（newTxs.length > 0）时：
                if (newTxs.length > 0) {
                    console.log("New transactions found:", newTxs.length);

                    const newIds = new Set<string>(
                        //注意，使用此行。interface Transaction的transactionHash，只能非可选。
                        // newTxs.map((tx: Transaction) => tx.transactionHash)

                        //若：interface Transaction的transactionHash，是可选，可以使用下面这行
                        /* 如果 transactionHash 可能为 undefined（不推荐，但安全） 你可以使用 filter(Boolean) 或手动排除 undefined：
                        这个 .filter((hash): hash is string => typeof hash === 'string') 是类型守卫，确保只保留 string 类型。
                         */

                        /* 
                        把所有新交易的 transactionHash 提取出来。
                            .map(tx => tx.transactionHash) 提取 transactionHash。
                            .filter((hash): hash is string => typeof hash === 'string') 进一步保证 hash 是字符串，
                            如果 transactionHash 是可选字段（可能为 undefined），这里就把非字符串的排掉了。
                            （类型守卫，这样 TypeScript 会知道这里 hash 肯定是 string）
                            最后用 Set 包起来，得到 newIds，是一个集合，存的是这批新交易的哈希。
                         */
                        newTxs
                            .map((tx: ITrans) => tx.transactionHash)
                            .filter((hash): hash is string => typeof hash === 'string')
                    );

                    /* 
                    把新的交易哈希集合保存到 React 的状态里。
                    可能是为了后续做高亮、新标记等处理，比如显示“新增交易”动画之类的。
                     */
                    setNewTransactionIds(newIds);

                    // 将新交易与现有交易合并（顶部为新交易）--把新的交易 (newTxs) 放在前面，旧的交易 (prevTxs) 放在后面。
                    // 原：Merge new transactions with existing ones (new at the top)
                    // 【注意：这里是创建了一个新的数组（不会直接改原数组），符合 React 状态更新的最佳实践。】
                    // setTrans((prevTxs: ITrans[]) => [...newTxs, ...prevTxs]);
                    setTrans((prevTxs: ITrans[]) => [...newTxs, ...prevTxs].slice(0, 300));

                    // 5秒后清除动画状态
                    // 原：Clear animation state after 5 seconds
                    setTimeout(() => {
                        setNewTransactionIds(new Set());
                    }, 5000);
                }
            }
        } catch (err) {
            console.error("Error polling for new transactions:", err);
        }
    };

    // 获取基础币种（Base Token）的交易值和符号
    const getBaseTokenValue = (tx: ITrans): ITokenValue => {
        // 如果交易数据中没有 baseTokenAmount，则返回默认值
        if (!tx.baseTokenAmount) return { value: 0, symbol: "" };

        // 将 baseTokenAmount 从字符串转换为数字
        const value = parseFloat(tx.baseTokenAmount);

        // 优先从 pairData 获取币种符号，如果没有则从 pair 获取
        // const symbol = pairData?.baseToken?.symbol || pair?.base_token?.symbol || "";
        const symbol = pairData?.baseToken?.symbol || tokenPair?.pair[0].token_symbol || "";

        return { value, symbol };
    };

    // 获取报价币种（Quote Token）的交易值和符号
    const getQuoteTokenValue = (tx: ITrans): ITokenValue => {
        // 如果交易数据中没有 quoteTokenAmount，则返回默认值
        if (!tx.quoteTokenAmount) return { value: 0, symbol: "" };

        // 转换为数字，并取绝对值（防止负数干扰展示）
        const value = parseFloat(tx.quoteTokenAmount);
        const absValue = Math.abs(value);

        // 优先从 pairData 获取币种符号，如果没有则从 pair 获取
        // const symbol = pairData?.quoteToken?.symbol || tokenPair?.quoteToken?.symbol || "";
        const symbol = pairData?.quoteToken?.symbol || tokenPair?.pair[1].token_symbol || "";

        return { value: absValue, symbol };
    };

    if (!tokenPair) {
        return (
            <div className="p-4 text-center text-dex-text-secondary">
                No pair data available
            </div>
        );
    }

    if (loading && trans.length === 0) {
        return (
            <div className="p-4 text-center text-dex-text-secondary">
                Loading transactions...
            </div>
        );
    }

    if (error && trans.length === 0) {
        return (
            // <div className="p-4 text-center text-dex-text-secondary">{error}</div>
            <div className="p-4 text-center text-dex-text-secondary">{error as string}</div>
        );
    }

    return (
        <>
            <table className="table table-xs">
                <thead>
                    <tr>
                        <th>时间</th>
                        <th>类型</th>
                        <th>总额&nbsp;USD</th>
                        <th>数量</th>
                        <th>花费</th>
                        <th>价格</th>
                        <th>交易者 </th>

                        {/* <th>总利润&nbsp;USD</th> */}
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {trans.map((tx, index) => {
                        // const txType = getTransType(tx.transactionType);
                        const txType = getTransType_V2(tx.transactionType);

                        const baseToken = getBaseTokenValue(tx);
                        const quoteToken = getQuoteTokenValue(tx);
                        const usdValue = formatValue_WithColor(
                            tx.totalValueUsd,
                            tx.transactionType
                        );
                        const price = formatPrice_WithColor(tx.baseTokenPriceUsd);
                        const isNew = newTransactionIds.has(tx.transactionHash);

                        // Create a unique key using transaction hash and index
                        const uniqueKey = `${tx.transactionHash}_${index}`;
                        // 若使用下面这行代码，会提示：
                        // 你在渲染列表组件时，使用了重复的 key 值，这会导致 React 的虚拟 DOM Diff 算法失效，渲染行为不可预测，可能出现 UI 错乱或更新失败。
                        // const uniqueKey = `${tx.transactionHash}_${tx.transactionIndex}`;

                        return (
                            <tr
                                key={uniqueKey}
                                /* className={`border-b border-dex-border hover:bg-dex-bg-secondary/50 ${isNew ? "animate-slide-in bg-dex-bg-highlight" : "" */
                                className={`border-b border-dex-border hover:bg-dex-bg-secondary/50 ${isNew ? "animate-slide-in bg-[rgba(255,255,255,0.08)]" : ""
                                    }`}
                            >
                                {/* <td className="px-4 py-3 text-dex-text-secondary whitespace-nowrap"> */}
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {/* {formatTimeAgo(tx.blockTimestamp)}-{index} */}
                                    {formatTimeAgo_fromCommon_v2(tx.blockTimestamp)}
                                </td>
                                <td
                                    /* className={`px-4 py-3 ${getTextColor(txType.text)} font-medium whitespace-nowrap`} */
                                    className={`px-4 py-3 ${txType.color1} font-medium whitespace-nowrap`}

                                >
                                    {txType.text}
                                </td>
                                <td
                                    /* className={`px-4 py-3 text-left ${usdValue.color} whitespace-nowrap`} */
                                    className={`px-4 py-3 text-left ${txType.color2} whitespace-nowrap`}
                                >
                                    {usdValue.text}
                                </td>
                                <td className="px-4 py-3 text-left whitespace-nowrap">
                                    {/* {baseToken.value ? formatNumber_fromCommon(baseToken.value, 4) : "-"} */}
                                    {baseToken.value ? formatNumber_fromInfo_v2(baseToken.value) : "-"}


                                </td>
                                <td className="px-4 py-3 text-left whitespace-nowrap">
                                    {quoteToken.value ? formatNumber_fromCommon(quoteToken.value, 4) : "-"}
                                    {quoteToken.value ? ` ${quoteToken.symbol}` : "-"}
                                    {/* {quoteToken.value ? formatNumber_fromInfo_v2(quoteToken.value) : "-"} */}
                                </td>
                                <td
                                    /* className={`px-4 py-3 text-left ${price.color} whitespace-nowrap`} */
                                    className={`px-4 py-3 text-left ${txType.color2} whitespace-nowrap`}
                                >
                                    {price.text}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <a
                                        href={getWalletExplorerUrl(tx.walletAddress, chainId, isSolana)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono hover:text-dex-blue flex items-center"
                                    >
                                        {/* <span className="bg-dex-bg-tertiary text-dex-text-primary px-1 rounded mr-1">
                                            🦊
                                        </span> */}
                                        {formatWalletAddress(tx.walletAddress)}
                                    </a>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <a
                                        // href={getExplorerUrl(tx.transactionHash)}
                                        href={getExplorerUrl(tx.transactionHash as string)}
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
        </>
    )
}