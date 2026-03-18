// "use client"
// import { useState, useEffect } from "react"
// "use client"
import Image from "next/image";


// import { LOWDB_TABLE_NAME, LOWDB_TABLE_QUERY_FIELD, TRADE_TAB_DEFAULT } from "@/config/web3_constants";

// import {TokenTradeAddress} from '@/components/Token/TradeAddress/Page';
// import { SplTokenTrans } from '@/components/Token/SplTokenTrans/Page';
import { TokenEvmHolders } from '@/components/TokenEvm/TokenEvmHolders/Page';
// import TokenTradeTrx from '@/components/TokenTradeTrx/Page';

import { Twitter } from "@/components/icons/medium/Twitter";
import { Telegram } from "@/components/icons/medium/Telegram";
import { WebSite } from "@/components/icons/medium/WebSite";

// import { getClient_ItemListUseSearch } from "@/unit/clientFunc";
// import { IKline, ITrx, IAddress } from "@/myLowdb";
// import { ILineItem } from "@/components/Token/TradingView/CandlestickChart";

// import "@/app/sol/token/[ca]/css/index.css";
import "@/app/css/token.css";
// import SplTokenTabs from "@/components/Token/SplTokenTabs/Page";
import { EvmTokenTabs } from "@/components/TokenEvm/TokenTabs/Page";
import { getApiChainId, getApiChainSimpleFromChainPath } from "@/utils/format/chain";
// import { IMoSplPair, IMoSplTokenPair, IMoSplTokenPairsResponse, IMoSplTokenProfile } from "@/interface/mo_spl";
// import { getSplFilteredSortedIndexes, getTopLiquidityIndexes } from "@/unit/format";
// import { IMoEvmPair, IMoEvmTokenPairsResponse, IMoEvmTokenMetadata, IMoEvmTokenMetadataList } from "@/interface/mo_evm";
import {
    IMoEvmPair, IMoEvmTokenPairsResponse,
    // IMoEvmTokenMetadata, 
    IMoEvmTokenMeta,
    // IMoEvmTokenMetadataList, 
    IMoEvmTokenMetaList,
    IMoUnifiedTokenMeta,
    unifyMoFromEvm,
    IMoSplTokenMeta,
    unifyMoFromSpl,
} from "@gr/interface-api/platform-data";

import { TokenEvmTrans } from "@/components/TokenEvm/TokenEvmTrans/Page";
import { EvmTokenHolderInsights } from "@/components/TokenEvm/TokenEvmHolderInsights/Page";
// import { EvmChart, EvmTokenChart } from "@/components/TokenEvm/EvmTokenChart/Page";
import { EvmTokenChart } from "@/components/Chart/TokenChart/Page";
import TokenInfo from "@/components/TokenEvm/TokenInfo/Page";
import { remoteImage } from "@/utils/remote_image";
import { formatPrice_Token, } from "@/utils/format/price";
import { shortenAddress } from "@/utils/format/chain";
import { formatTimeAgo_fromCommon_v2 } from "@/utils/format/time";
import { isTChainName, TChainName } from "@gr/interface-base";

interface IPageProps {
    params: Promise<{
        chainName: string; // 路径参数 ca：通过 params.ca 获取（必须）
        ca: string; // 路径参数 ca：通过 params.ca 获取（必须）
    }>;
    searchParams: Promise<{
        tab?: string; //查询参数 tab：通过 searchParams.tab 获取（可选）
        // searchParams: URLSearchParams;
    }>;
}

const NEST_URL = process.env.NEXT_PUBLIC_NEST_API_HOST;

export default async function Page({ params, searchParams }: IPageProps) {
    /* export default async function Page({ params }: { params: { ca: string } }) { */
    // const findId = await params.then((value) => value.address)  // 使用.then()方法获取Promise的值
    // const [selectTab, setSelectTab] = useState<string>(TRADE_TAB_DEFAULT);
    /* let tokenRes:any;
    let klineRes:any;
    let addressRes:any;
    useEffect(() => {
        // tokenRes = await getItem(LOWDB_TABLE_NAME.TOKEN, LOWDB_TABLE_QUERY_FIELD.CA, p_ca);
        tokenRes = getItem(LOWDB_TABLE_NAME.TOKEN, LOWDB_TABLE_QUERY_FIELD.CA, p_ca);
        klineRes = getItemListUseSearch(LOWDB_TABLE_NAME.KLINE, p_ca, 1, 100);
        addressRes = getItemListUseSearch(LOWDB_TABLE_NAME.ADDRESS, p_ca, 1, 100);
      }, []); // 空依赖数组只会在组件挂载时执行一次 */

    /* let loadingState: string = "initial"; */
    //-------------------------读取 token 信息-------------------------

    // const { evmType: p_evmType } = await params;
    // const { ca: p_ca } = await params;
    // 上两行，合并后
    // const { evmType: p_evmType, ca: p_ca } = await params;
    const { ca: p_ca, chainName } = await params;

    //非法：chainName校验
    let use_chainName = chainName;
    if (isTChainName(use_chainName) === false) {
        if (p_ca.startsWith("0x") === true) {
            use_chainName = "eth";
        } else {
            use_chainName = "sol";
        }
    }
    console.log('use_chainName=', use_chainName);
    // console.log('p_ca', p_ca);

    // const tabFromUrl = searchParams.tab ?? "transactions";
    // const tabFromUrl = searchParams.tab ?? "transactions";

    // const tabFromUrl = searchParams.get("tab");
    const fallbackTab: string = "transactions";
    // const tabFromUrl = await searchParams.tab?? fallbackTab;
    let { tab: tabFromUrl } = await searchParams;
    if (tabFromUrl === undefined) tabFromUrl = fallbackTab;

    // console.log('tabFromUrl=', tabFromUrl);
    const validTabs = ["transactions", "holders", "holder-insights", "snipers"];
    const activeTab = validTabs.includes(tabFromUrl ?? "") ? tabFromUrl! : fallbackTab;

    // const chainPath: string = "solana";
    // const chainPath: string = "bsc";
    const chainId = getApiChainId(use_chainName);
    const chainSimple = getApiChainSimpleFromChainPath(use_chainName);
    const isSolana = chainId === "solana";
    // const tokenRes = await getServer_Mock_Item(LOWDB_TABLE_NAME.TOKEN, LOWDB_TABLE_QUERY_FIELD.CA, p_ca);
    //-------------- get token pairs --------------
    const token_pairs_url = `${NEST_URL}/api-mo/${chainSimple}/token_pairs/${p_ca}`
    console.log('token_pairs_url=', token_pairs_url);
    //token_pairs_response 返回的结果，是按照liquidity降序排列的
    const token_pairs_response = await fetch(token_pairs_url);
    if (token_pairs_response === undefined) return (
        <div>&quot;token_pairs_response === undefined&quot;,404</div>
    )

    // const TokenPairsRes: IMoSplTokenPairsResponse = await token_pairs_response.json();
    const moEvm_TokenPairsRes: IMoEvmTokenPairsResponse = await token_pairs_response.json();

    //-------------- get token meta --------------
    // const token_meta_url = `${NEST_URL}/mo/${chainSimple}/token_metadata/${p_ca}`
    const token_meta_url = `${NEST_URL}/api-mo/${chainSimple}/token_meta/${p_ca}`
    const token_meta_response = await fetch(token_meta_url);

    if (token_meta_response === undefined) return (
        <div>&quot;token_meta_response === undefined&quot;,404</div>
    )


    // const TokenMetaRes: IMoSplTokenProfile = await token_meta_response.json();
    // const TokenMetaRes: IMoEvmTokenProfile = await token_meta_response.json();

    let moUnified_TokenMeta: IMoUnifiedTokenMeta;
    
    if (isSolana) {        
        const moSpl_TokenMetaRes: IMoSplTokenMeta = await token_meta_response.json();
        moUnified_TokenMeta = unifyMoFromSpl(moSpl_TokenMetaRes, use_chainName as TChainName);
    } else {
        //注意：evm链，的Get ERC20 token metadata by contract,返回的是数组。与sol返回单个对象不同
        const moEvm_TokenMetaList: IMoEvmTokenMetaList = await token_meta_response.json();
        const moEvm_TokenMetaRes: IMoEvmTokenMeta = moEvm_TokenMetaList[0];
        moUnified_TokenMeta = unifyMoFromEvm(moEvm_TokenMetaRes, use_chainName as TChainName);
    }


    // console.log('TokenMetaRes=', TokenMetaRes);

    //-------------- 
    // const activeTab: string = "transactions";

    // const top: number = 30;
    //-------------- 
    /* const topIndexes = getTopLiquidityIndexes(TokenPairsRes,top);
    console.log(`前 ${top} 大 liquidity 的 index:`, topIndexes); */
    //-------------- 
    // const topFilteredIndexes: number[] = getFilteredSortedIndexes(TokenPairsRes, 2000, top);
    // console.log(`前 ${top} 个usdPrice最小且liquidity大于2000的index:`, topFilteredIndexes);
    //-------------- 
    // let TokenPairInfo: IMoSplPair = {} as IMoSplPair;
    let TokenPairInfo: IMoEvmPair = {} as IMoEvmPair;

    // let currentToken:IMoEvmPair|undefined;
    if (
        moEvm_TokenPairsRes.pairs[0].pair &&
        moEvm_TokenPairsRes.pairs[0].pair.length > 0
        /* 
        normalizedPairs[0].pair &&
        normalizedPairs[0].pair.length > 0
         */
    ) {
        // Try to find the token in the pair data
        const currentToken = moEvm_TokenPairsRes.pairs[0].pair.find(
            // currentToken = TokenPairsRes.pairs[0].pair.find(
            (token) =>
                token.token_address &&
                //   token.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
                token.token_address.toLowerCase() === p_ca.toLowerCase()
        );

        if (currentToken) {
            TokenPairInfo = currentToken;
        } else {
            // Fallback if token not found in pair data
            console.log(
                "Token not found in pair data, using first token as fallback ( 在配对数据中找不到令牌，使用第一个令牌作为回退 )"
            );
            const fallbackToken = moEvm_TokenPairsRes.pairs[0].pair[0];
            TokenPairInfo = fallbackToken;
            TokenPairInfo.token_address = p_ca;    //修改ca
        }
    }

    /* loadingState = "complete"; */
    /* if (tokenRes.code !== 200) return (
        <div>"tokenRes.code !== 200",404</div>
    ) */
    // console.log('response->', response);
    // console.log('tokenRes.data->', tokenRes.data);


    //const { data: item } = tokenRes;

    //

    //-------------------------读取 mock kline 信息-------------------------
    /* const lineData: ILineItem[] = [];
    //获取最新 100条 k线数据
    const klineRes = await getServer_Mock_ItemListUseSearch(LOWDB_TABLE_NAME.KLINE, p_ca, 1, 100);

    if (klineRes === undefined) return (
        <div>"klineRes === undefined",404</div>
    )

    if (klineRes.code !== 200) return (
        <div>"klineRes.code !== 200",404</div>
    )
    console.log('klineRes->', klineRes);
    console.log('klineRes.data', klineRes.data);


    klineRes.data.list.map((item: IKline) => {
        // lineData.push({
        // 注意：tv图表的要求，k线数据必须降序
        lineData.unshift({
            time: item.time,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
        })
    }) */

    //-------------------------读取 trade_address 信息-------------------------
    //获取最新 100条 trans数据
    /* const addressRes = await getServer_Mock_ItemListUseSearch(LOWDB_TABLE_NAME.ADDRESS, p_ca, 1, 100);
    if (addressRes === undefined) return (
        <div>"addressRes === undefined",404</div>
    )

    if (addressRes.code !== 200) return (
        <div>"addressRes.code !== 200",404</div>
    )
    console.log('addressRes->', addressRes);
    console.log('addressRes.data', addressRes.data); */

    // console.log('lineData', lineData);
    /* const pid = params.ca */
    return (
        <>
            {/* <div className="token-body">

            </div> */}
            <div className="token-body">
                <div className="token-body-left min-w-0 min-h-0">
                    <div className='token-info'>
                        <div className='token-info-left'>
                            <div className='flex flex-row items-center'>
                                <div className="w-8 px-1 mr-2">
                                    <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label>
                                </div>
                                <div className='flex flex-row items-center mr-2'>
                                    <div className="avatar">
                                        <div className="mask mask-squircle h-12 w-12">
                                            <Image
                                                unoptimized
                                                width={48} height={48}
                                                // src={item.imageUrl}
                                                src={remoteImage(moUnified_TokenMeta.logo)}
                                                // alt={item.name} 
                                                alt={moUnified_TokenMeta.name}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex flex-row items-center mr-2'>
                                        <div className='mr-1 text-lg font-bold'>{moUnified_TokenMeta.name}</div>
                                        <div className='mr-1 text-xs opacity-60'>{moUnified_TokenMeta.symbol}</div>
                                        {/* <div className='mr-1 text-sm text-base-content opacity-80'>{shortenAddress(moUnified_TokenMeta.address)}</div> */}
                                        <div className='mr-1 text-sm text-base-content opacity-80'>{shortenAddress(TokenPairInfo.token_address)}</div>
                                        
                                    </div>

                                    <div className='flex flex-row'>
                                        {/* <div>Time:{item.time}</div> */}
                                        <div>{formatTimeAgo_fromCommon_v2(moUnified_TokenMeta.moEvm!.created_at)}</div>
                                        <div>
                                            <span className="badge badge-ghost badge-sm">
                                                {/* <a href={TokenMetaRes.links.moralis}>moralis</a>&nbsp; */}
                                                <a href={moUnified_TokenMeta.links.twitter}><Twitter /></a>&nbsp;
                                                <a href={moUnified_TokenMeta.links.website}><WebSite /></a>&nbsp;
                                                <a href={moUnified_TokenMeta.links.telegram}><Telegram /></a>&nbsp;


                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='token-info-right text-emerald-500'>
                            <div className="price-symbol">$</div>
                            {/* <div className="price-value">{TokenPairInfo.liquidity_usd}</div> */}
                            <div className="price-value">
                                {/* {formatPrice_fromInfo_v1(TokenPairsRes.pairs[0].usd_price)} */}
                                {formatPrice_Token(moEvm_TokenPairsRes.pairs[0].usd_price, "")}

                            </div>

                        </div>
                    </div>
                    <div className="token-k-line">
                        {/* <div className="w-full h-[400px] display-block"> */}
                        {/* <CandleChart line={lineData} /> */}
                        <EvmTokenChart
                            tokenPair={moEvm_TokenPairsRes.pairs[0]}
                            // timeFrame="1w"
                            timeFrame="30m"
                        />

                        {/* <CandlestickChart address={item.address} /> */}
                    </div>
                    <div className="token-trade flex flex-col">


                        {/* Tabs section */}
                        <div className="border-t border-dex-border">
                            <EvmTokenTabs
                                // activeTab={activeTab}
                                // onChange={setActiveTab}
                                initialTab={activeTab}
                                isSolana={isSolana}
                            />
                        </div>
                        {/* <div className="token-trade-tab"> */}
                        {/*来源： https://flowbite.com/docs/components/tabs/ */}

                        {/* <div className="sm:hidden">
                                <label className="sr-only">Select your country</label>
                                <select id="tabs" className="bg-gray-50 border border-gray-300 text-gray-900 text-[10px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option>Profile</option>
                                    <option>Dashboard</option>
                                    <option>setting</option>
                                    <option>Invoioce</option>
                                </select>
                            </div> */}

                        {/* <ul className="hidden text-[10px]  font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                                <li className="w-full focus-within:z-10 ">
                                    <a href="#" className=" inline-block w-full p-4 text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white" aria-current="page">
                                        全部
                                    </a>
                                </li>
                                <li className="w-full focus-within:z-10">
                                    <a href="#" className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
                                        聪明钱
                                    </a>
                                </li>
                                <li className="w-full focus-within:z-10">
                                    <a href="#" className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
                                        KOL/VC
                                    </a>
                                </li>
                                <li className="w-full focus-within:z-10">
                                    <a href="#" className="inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
                                        老鼠仓
                                    </a>
                                </li>
                            </ul> */}
                        {/* Tabs section */}
                        {/* <div className="border-t border-dex-border">
                                <TokenTabs
                                    activeTab={activeTab}
                                    onChange={setActiveTab}
                                    isSolana={isSolana}
                                />
                            </div> */}
                        {/* <div role="tablist" className="tabs tabs-boxed">
                                <a role="tab" className="tab text-[10px]">全部</a>
                                <a role="tab" className="tab text-[10px] tab-active">聪明钱</a>
                                <a role="tab" className="tab text-[10px]">KOL/VC</a>
                            </div> */}
                        {/* <div role="tablist" className="tabs tabs-lifted">
                                <a role="tab" className="tab">全部</a>
                                <a
                                    role="tab"
                                    className="tab tab-active text-primary [--tab-bg:yellow] [--tab-border-color:orange]">
                                    聪明钱
                                </a>
                                <a role="tab" className="tab">KOL/VC</a>
                            </div> */}
                        {/* </div> */}
                        <div className="flex-1 overflow-auto">
                            {activeTab === "transactions" && (
                                <TokenEvmTrans
                                    tokenPair={moEvm_TokenPairsRes.pairs[0]}
                                    // chainId={TokenPairsRes.pairs[0]?.chainId}
                                    chainId={chainId}
                                />
                            )}

                            {activeTab === "holders" && (
                                <TokenEvmHolders ca={TokenPairInfo.token_address} chainId={chainId} />
                            )}

                            {activeTab === "holder-insights" && (
                                <EvmTokenHolderInsights ca={TokenPairInfo.token_address} chainId={chainId} />
                            )}
                        </div>
                        {/* <div className="token-trade-content">
                            <div className="overflow-x-auto">
                                <TokenTrans
                                    pair={TokenPairsRes.pairs[0]}
                                    // chainId={TokenPairsRes.pairs[0]?.chainId}
                                    chainId={chainId}

                                />
                            </div>
                        </div> */}

                    </div>
                </div>
                <div className="token-right flex flex-col">
                    <TokenInfo
                        symbol={TokenPairInfo.token_symbol}
                        ca={TokenPairInfo.token_address}
                        tokenPair={moEvm_TokenPairsRes.pairs[0]}
                        // tokenMetadata={moEvm_TokenMetaRes}
                        tokenMetadata={moUnified_TokenMeta}
                        // ca={TokenPairInfo.token_address} 
                        chainId={chainId} />
                    {/* <div className="token-right-item h-[100px]">
                        <span>媒体</span>
                    </div>
                    <div className="token-right-item h-[1100px]">
                        <span>交易</span>
                    </div>
                    <div className="token-right-item h-[300px]">
                        <span>市场</span>
                    </div>
                    <div className="token-right-item h-[300px]">
                        <span>池子/创建人</span>
                    </div> */}
                </div>
            </div>
        </>


    )
}


