import { Injectable } from '@nestjs/common';
import {
    ISolSplTokenItem, ISolSplTokenListResponse, 
    // ISolSplTokenMeta,ISolSplTokenMetaMultiResponse, ISolSplTokenMetaResponse, ISolSplTokenPriceMultiResponse
    // } from 'src/interface/sol_spl';
} from '@gr/interface-api/platform-data';
import { getTodayAsUTCString, safeAssign, isPriceMissing } from 'src/utils/format/format';
// import { isNil } from '@nestjs/common/utils/shared.utils';
import { Redis as IoRedis } from 'ioredis';
// import { getTokenMetaTtl } from 'src/time/ioredisTtl';
import { AxiosClient } from '@gr/axios-client';
import { 
    fetch_SolSpl_TokenItem_From_Api,
    load_SolSpl_TokenMeta_From_Redis,
    write_SolSpl_TokenMeta_To_Redis,
} from 'src/utils/api/platform-data/api-sol_meta';

import { fetch_SolSplTokenPriceMulti_And_MergePrice as fetch_SolSpl_TokenPriceMulti_And_MergePrice } from 'src/utils/api/platform-data/api-sol_price';
import { CACHE_KEY_HEAD, CACHE_KEY_TEMPLATE } from 'src/constant/CACHE_KEY';
@Injectable()
export class ApiSolService {
    // 私有成员变量 getJson_Sol
    private readonly getJson_Sol: (url: string, errMsg: string) => Promise<any>;
    private readonly solAxios: AxiosClient;  //调用sol平台api的axios
    
    constructor(

        // @Inject('REDIS_CLIENT') protected readonly redisClient: IoRedis,
        private readonly redisClient: IoRedis,

    ) {
        /* getJson_Sol只在构造函数中绑定一次
        后续需要用到：this.getJsonFromUrl_Sol.bind(this) 的地方，直接用：this.getJson_Sol，就可以．
         */
        this.getJson_Sol = this.getJsonFromUrl_Sol.bind(this); // ✅ 

        //sol平台api的axios的初始化
        const API_SOL_KEY = process.env.API_SOL_KEY as string;
        this.solAxios = new AxiosClient({
            baseURL: '',    // 不加前缀，使用完整 URL            
            headers: {
                accept: "application/json",
                "token": API_SOL_KEY,
            },
        });
    }
    
    getJsonFromUrl_Sol = async (url: string, errPrint: string): Promise<any> => {
        console.log("getJsonFromUrl_Sol->Fetching from URL:", url);
        try {
            // axios 版
            return this.solAxios.get(url);
        } catch (error) {
            console.error(errPrint, error);
            throw error;
        }
    }

    getTextFromUrl = async (url: string, errPrint: string): Promise<any> => {
        const API_KEY = process.env.API_SOL_KEY as string;
        // console.log('API_KEY=', API_KEY)
        console.log("Fetching from URL:", url);

        try {
            const response = await fetch(url, {
                headers: {
                    accept: "application/json",
                    // "X-API-Key": API_KEY,
                    "token": API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const text = await response.text();
            return text;
        } catch (error) {
            console.error(errPrint, error);
            throw error;
        }
    }

    //------------------------------- Token --------------------------------------------------------------
    getTokenTransFromCa = async (
        ca: string,
    ): Promise<any> => {

        let url: string;
        const sort_by: string = 'block_time';
        const sort_order: string = 'desc';
        const page = 1;
        const page_size = 10;   //只能取值：10、20、30、40、60、100


        // https://pro-api.solscan.io/v2.0/token/transfer?address=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263&page=1&page_size=10&sort_by=block_time&sort_order=desc
        url = `https://pro-api.solscan.io/v2.0/token/transfer?address=${ca}&page=${page}&page_size=${page_size}&sort_by=${sort_by}&sort_order=${sort_order}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getTokenTrans():");
    }

    getTokenDefiActivityFromCa = async (
        ca: string,
    ): Promise<any> => {

        let url: string;
        const sort_by: string = 'block_time';
        const sort_order: string = 'desc';
        const page = 1;
        const page_size = 10;   //只能取值：10、20、30、40、60、100

        // https://pro-api.solscan.io/v2.0/token/defi/activities?address=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN&page=1&page_size=10&sort_by=block_time&sort_order=desc
        url = `https://pro-api.solscan.io/v2.0/token/defi/activities?address=${ca}&page=${page}&page_size=${page_size}&sort_by=${sort_by}&sort_order=${sort_order}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getTokenDefiActivity():");
    }

    getTokenMarketsFromCaArray = async (
        caArray: string,
    ): Promise<any> => {

        let url: string;
        let caArrayLine: string;

        // 注意：caArray只能是1-2个ca地址
        // 若 caArray　超过2个地址，会提示："Validation Error: \"token\" must contain less than or equal to 2 items"（验证错误：“令牌”必须包含少于或等于2个项目）

        // 先判断 caArray是否有：“,”字符。若有“,”字符，则将所有“,”字符替换为“&token[]=”
        if (caArray.includes(",")) {
            // 正则 g 表示全局替换
            caArrayLine = caArray.replace(/,/g, "&token[]=");
        } else {
            caArrayLine = caArray;
        }


        // const sort_by: string = 'block_time';
        // const sort_order: string = 'desc';
        const page = 1;
        const page_size = 10;   //只能取值：10、20、30、40、60、100

        // https://pro-api.solscan.io/v2.0/token/markets?token[]=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&token[]=USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX&page=1&page_size=10
        // 
        url = `https://pro-api.solscan.io/v2.0/token/markets?token[]=${caArrayLine}&page=${page}&page_size=${page_size}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getTokenMarkets():");
    }

    getTokenMetaFromCa = async (
        ca: string,
    ): Promise<any> => {

        let url: string;

        url = `https://pro-api.solscan.io/v2.0/token/meta?address=${ca}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getTokenMeta():");
    }

    getTokenMetaMultiFromCaArray = async (
        caArray: string,
    ): Promise<any> => {

        let url: string;
        let caArrayLine: string;

        // 先判断 caArray是否有：“,”字符。若有“,”字符，则将所有“,”字符替换为“&address[]=”
        if (caArray.includes(",")) {
            // 正则 g 表示全局替换
            caArrayLine = caArray.replace(/,/g, "&address[]=");
        } else {
            caArrayLine = caArray;
        }

        // one ca https://pro-api.solscan.io/v2.0/token/meta/multi?address[]=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN
        // multi ca https://pro-api.solscan.io/v2.0/token/meta/multi?address[]=JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN&address[]=EVh5ABxiQY3YfyGnq5S3mSfHizkYyddKrBTRgaZLpump
        url = `https://pro-api.solscan.io/v2.0/token/meta/multi?address[]=${caArrayLine}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getTokenMetaMulti():");
    }

    getTokenPriceFromCa = async (
        ca: string,
    ): Promise<any> => {

        let url: string;

        // https://pro-api.solscan.io/v2.0/token/price?address=So11111111111111111111111111111111111111112
        url = `https://pro-api.solscan.io/v2.0/token/price?address=${ca}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getTokenPrice():");
    }

    getTokenPriceMultiFromCaArray = async (
        caArray: string,
    ): Promise<any> => {

        const todayStr: string = getTodayAsUTCString();
        const from_time: string = todayStr;
        const to_time: string = todayStr;

        let url: string;
        let caArrayLine: string;

        // 先判断 caArray是否有：“,”字符。若有“,”字符，则将所有“,”字符替换为“&address[]=”
        if (caArray.includes(",")) {
            // 正则 g 表示全局替换
            caArrayLine = caArray.replace(/,/g, "&address[]=");
        } else {
            caArrayLine = caArray;
        }

        // one ca https://pro-api.solscan.io/v2.0/token/price/multi?address[]=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
        // multi ca https://pro-api.solscan.io/v2.0/token/price/multi?address[]=EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm&address[]=6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN&address[]=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R&from_time=20250430&to_time=20250430

        url = `https://pro-api.solscan.io/v2.0/token/price/multi?address[]=${caArrayLine}&from_time=${from_time}&to_time=${to_time}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getTokenPriceMulti():");
    }

    getTokenHoldersFromCa = async (
        ca: string,
    ): Promise<any> => {

        let url: string;
        const page = 1;
        //page_size,只能取值：10/20/30/40
        //若 page_size 取值不是：10/20/30/40 ，会返回：Error: Failed to fetch: 400 Bad Request
        const page_size = 40;

        url = `https://pro-api.solscan.io/v2.0/token/holders?address=${ca}&page=${page}&page_size=${page_size}`;
        // url = `https://pro-api.solscan.io/v2.0/token/trending?limit=${limit}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getTokenHolders():");
    }

    getTokenListBySortStr_v4 = async (
        // sortStr的取值范围: holder, market_cap, created_time
        sortStr: string,
    ): Promise<any> => {
        // const CACHE_KEY_HEAD_FROM_SOL_SOL_TOKEN_META = 'GET:/sol/sol/token_meta/';
        const BATCH_SIZE: number = 20;
        // const now = Math.floor(Date.now() / 1000);
        // let url: string;
        const sort_order: string = 'desc';
        const page = 1;
        // const page_size = 100;
        const page_size = 40;

        const get_token_list_url: string = `https://pro-api.solscan.io/v2.0/token/list?sort_by=${sortStr}&sort_order=${sort_order}&page=${page}&page_size=${page_size}`;

        const tokenListRes: ISolSplTokenListResponse = await this.getJsonFromUrl_Sol(get_token_list_url, "Error fetching getTokenListBySortStr_v2():");

        // const addressWithoutMetadataCache: string[] = [];

        //------------【第一部分: 遍历每个 token，尝试读取 Redis 缓存作为 metadata】************************------------
        /* 
        遍历 tokenListRes.data[] 中的每个 token，尝试用 address 去 Redis 中获取缓存；
        如果 cached 存在（一般是 JSON 字符串），就将其解析后设置为该 token 的 metadata 字段。
         */
        // 从缓存加载
        // const addressWithoutCache = await this.loadMetaFromRedis(
        const addressWithoutCache = await load_SolSpl_TokenMeta_From_Redis(
            tokenListRes.data,
            this.redisClient,
            // CACHE_KEY_HEAD_FROM_SOL_SOL_TOKEN_META
            CACHE_KEY_TEMPLATE.GET_SOL_SOL_TOKEN_META
        );


        //------------【第二部分: 将未能从缓存读取到metadata的address列表,拆分成每次最多 20 个地址的数组.
        //------------ 然后构造多个请求发送给 Solscan API，并将所有响应合并更新到 tokenListRes.data 中。】************************------------
        //------------ 附加操作:从api批量读取到metadata数据,还需要遍历:封装成标准格式的 ISolSplTokenMetaResponse,更新到缓存中.根据token上线时间,设置ttl ************************------------
        /* 
        以下是改造后的完整代码逻辑，核心处理逻辑包括：
            1:将地址拆分为数组；
            2:每 20 个为一组发送请求；
            3:将所有返回的数据合并到 Map<string, ISolSplTokenItem>；
            4:最后再将数据合并到 tokenListRes.data 中。
         */
        // 最终拼接成用 "," 分隔的字符串
        // const addressWithoutMetadataCacheStr: string = addressWithoutMetadataCache.join(",");
        // 1. 地址数组
        // 不加条件判断 "".split(",") // 返回 [""] 而不是 [].会造成addressWithoutMetadataCacheStr为空时.addressWithoutMetadataCacheArray长度为1
        // const addressWithoutMetadataCacheArray = addressWithoutMetadataCacheStr.split(",");


        // 拉取未命中数据
        // const metaMap = await this.fetchMetaFromAPI(addressWithoutCache, BATCH_SIZE);
        // this.getJsonFromUrl_Sol.bind(this) --这种写法是**依赖注入（Dependency Injection）**的一种形式：
        // const metaMap = await fetchMetaFromAPI(addressWithoutCache, BATCH_SIZE, this.getJsonFromUrl_Sol.bind(this));
        const metaMap = await fetch_SolSpl_TokenItem_From_Api(addressWithoutCache, BATCH_SIZE, this.getJson_Sol);

        // 写入缓存
        // await this.writeMetaToRedis(metaMap, this.redisClient, CACHE_KEY_HEAD, now);
        await write_SolSpl_TokenMeta_To_Redis(
            metaMap, 
            this.redisClient, 
            CACHE_KEY_TEMPLATE.GET_SOL_SOL_TOKEN_META);

        // 合并 meta 到原始数据
        tokenListRes.data.forEach(originalToken => {
            const meta = metaMap.get(originalToken.address);
            if (meta) {
                for (const key in meta) {
                    const typedKey = key as keyof ISolSplTokenItem;
                    safeAssign(originalToken, typedKey, meta[typedKey]);
                }
            }
        });

        //------------【第三部分: 更新价格--注意:价格不能像Metadata一样，需要实时访问api.不能读缓存数据】************************------------
        const todayStr: string = getTodayAsUTCString();

        // await this.fetchAndMergePrice(tokenListRes.data, todayStr, todayStr, BATCH_SIZE);
        // await fetchAndMergePrice(tokenListRes.data, todayStr, todayStr, BATCH_SIZE, this.getJsonFromUrl_Sol.bind(this));
        await fetch_SolSpl_TokenPriceMulti_And_MergePrice(tokenListRes.data, todayStr, todayStr, BATCH_SIZE, this.getJson_Sol);
        // }

        //返回的数据，已经补全，原先缺失的值
        return tokenListRes;

    }

    getTokenListBySortStr_v3 = async (
        // sortStr的取值范围: holder, market_cap, created_time
        sortStr: string,
    ): Promise<any> => {
        const CACHE_KEY_HEAD = 'GET:/sol/sol/token_meta/';
        const BATCH_SIZE: number = 20;
        const now = Math.floor(Date.now() / 1000);
        // let url: string;
        const sort_order: string = 'desc';
        const page = 1;
        // const page_size = 100;
        const page_size = 40;

        const get_token_list_url: string = `https://pro-api.solscan.io/v2.0/token/list?sort_by=${sortStr}&sort_order=${sort_order}&page=${page}&page_size=${page_size}`;

        const tokenListRes: ISolSplTokenListResponse = await this.getJsonFromUrl_Sol(get_token_list_url, "Error fetching getTokenListBySortStr_v2():");

        // const addressWithoutMetadataCache: string[] = [];

        // 从缓存加载
        // const addressWithoutCache = await this.loadMetaFromRedis(
        const addressWithoutCache = await load_SolSpl_TokenMeta_From_Redis(
            tokenListRes.data,
            this.redisClient,
            CACHE_KEY_HEAD
        );

        // 拉取未命中数据        
        const metaMap = await fetch_SolSpl_TokenItem_From_Api(addressWithoutCache, BATCH_SIZE, this.getJson_Sol);

        // 写入缓存
        // await this.writeMetaToRedis(metaMap, this.redisClient, CACHE_KEY_HEAD, now);
        await write_SolSpl_TokenMeta_To_Redis(
            metaMap, 
            this.redisClient, 
            CACHE_KEY_HEAD, 
            // now
        );

        // 合并 metadata 到原始数据
        tokenListRes.data.forEach(originalToken => {
            const meta = metaMap.get(originalToken.address);
            if (meta) {
                for (const key in meta) {
                    const typedKey = key as keyof ISolSplTokenItem;
                    safeAssign(originalToken, typedKey, meta[typedKey]);
                }
            }
        });

        //------------【第三部分: 更新价格--注意:价格不能像Metadata一样，需要实时访问api.不能读缓存数据】************************------------
        const todayStr: string = getTodayAsUTCString();
        
        await fetch_SolSpl_TokenPriceMulti_And_MergePrice(tokenListRes.data, todayStr, todayStr, BATCH_SIZE, this.getJson_Sol);
        // }

        //返回的数据，已经补全，原先缺失的值
        return tokenListRes;

    }

    getTokenTop = async (
        // sortStr: string,
    ): Promise<any> => {

        let url: string;


        url = `https://pro-api.solscan.io/v2.0/token/top`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getTokenTop():");
    }

    getTokenTrending = async (
        limit: number,
    ): Promise<any> => {

        let url: string;

        url = `https://pro-api.solscan.io/v2.0/token/trending?limit=${limit}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getTokenTrending():");
    }

    //------------------------------- Account (Aa) --------------------------------------------------------------
    getAccountTransDescFromAa = async (
        aa: string,
    ): Promise<any> => {
        let url: string;
        const sort_by: string = 'block_time';
        const sort_order: string = 'desc';
        const page = 1;
        const page_size = 10;   //只能取值：10、20、30、40、60、100

        // https://pro-api.solscan.io/v2.0/account/transfer?address=BeKT2DGVovGjU6x1oQ1hUJJRjJtQMQkTrR1maue2ALPY&page=1&page_size=10&sort_by=block_time&sort_order=desc
        url = `https://pro-api.solscan.io/v2.0/account/transfer?address=${aa}&page=${page}&page_size=${page_size}&sort_by=${sort_by}&sort_order=${sort_order}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getAccountTransDesc():");
    }

    getAccountTransAscFromAa = async (
        aa: string,
    ): Promise<any> => {
        let url: string;
        const sort_by: string = 'block_time';
        const sort_order: string = 'asc';
        const page = 1;
        const page_size = 10;   //只能取值：10、20、30、40、60、100

        // https://pro-api.solscan.io/v2.0/account/transfer?address=BeKT2DGVovGjU6x1oQ1hUJJRjJtQMQkTrR1maue2ALPY&page=1&page_size=10&sort_by=block_time&sort_order=desc
        url = `https://pro-api.solscan.io/v2.0/account/transfer?address=${aa}&page=${page}&page_size=${page_size}&sort_by=${sort_by}&sort_order=${sort_order}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getAccountTransAsc():");
    }

    getAccountDefiActivityFromAa = async (
        aa: string,
    ): Promise<any> => {
        let url: string;
        const sort_by: string = 'block_time';
        const sort_order: string = 'desc';
        const page = 1;
        const page_size = 10;   //只能取值：10、20、30、40、60、100

        // https://pro-api.solscan.io/v2.0/account/defi/activities?address=BeKT2DGVovGjU6x1oQ1hUJJRjJtQMQkTrR1maue2ALPY&page=1&page_size=10&sort_by=block_time&sort_order=desc
        url = `https://pro-api.solscan.io/v2.0/account/defi/activities?address=${aa}&page=${page}&page_size=${page_size}&sort_by=${sort_by}&sort_order=${sort_order}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getAccountDefiActivity():");
    }

    getAccountBalanceChangeActivityFromAa = async (
        aa: string,
    ): Promise<any> => {
        let url: string;
        const sort_by: string = 'block_time';
        const sort_order: string = 'desc';
        const page = 1;
        const page_size = 10;   //只能取值：10、20、30、40、60、100

        // https://pro-api.solscan.io/v2.0/account/balance_change?address=BeKT2DGVovGjU6x1oQ1hUJJRjJtQMQkTrR1maue2ALPY&page_size=10&page=1&sort_by=block_time&sort_order=desc
        url = `https://pro-api.solscan.io/v2.0/account/balance_change?address=${aa}&page=${page}&page_size=${page_size}&sort_by=${sort_by}&sort_order=${sort_order}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getAccountBalanceChangeActivity():");
    }

    getAccountPortfolioFromAa = async (
        aa: string,
    ): Promise<any> => {

        let url: string;

        // https://pro-api.solscan.io/v2.0/account/portfolio?address=BeKT2DGVovGjU6x1oQ1hUJJRjJtQMQkTrR1maue2ALPY
        url = `https://pro-api.solscan.io/v2.0/account/portfolio?address=${aa}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getTokenPortfolio():");
    }

    getAccountTokenAccountsFromAa = async (
        aa: string,
    ): Promise<any> => {
        let url: string;

        const type: string = 'token';
        const page = 1;
        const page_size = 10;   //只能取值：10、20、30、40

        // https://pro-api.solscan.io/v2.0/account/token-accounts?address=BeKT2DGVovGjU6x1oQ1hUJJRjJtQMQkTrR1maue2ALPY&type=token&page=1&page_size=10
        url = `https://pro-api.solscan.io/v2.0/account/token-accounts?address=${aa}&type=${type}&page=${page}&page_size=${page_size}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getAccountTokenAccounts():");
    }

    getAccountTransExportFromAa = async (
        aa: string,
    ): Promise<any> => {

        let url: string;
        // const exclude_amount_zero: string = 'false'; //.false:包括金额为零的转账
        const exclude_amount_zero: string = 'true'; //true:不包括金额为零的转账

        // https://pro-api.solscan.io/v2.0/account/transfer/export?address=BeKT2DGVovGjU6x1oQ1hUJJRjJtQMQkTrR1maue2ALPY
        url = `https://pro-api.solscan.io/v2.0/account/transfer/export?address=${aa}&exclude_amount_zero=${exclude_amount_zero}`;

        // 注意：返回的是。用“,”分隔的text表格，不是json字符串
        return this.getTextFromUrl(url, "Error fetching getAccountTransExport():");
    }

    getAccountMetaFromAa = async (
        aa: string,
    ): Promise<any> => {

        let url: string;

        // https://pro-api.solscan.io/v2.0/account/metadata?address=BeKT2DGVovGjU6x1oQ1hUJJRjJtQMQkTrR1maue2ALPY
        url = `https://pro-api.solscan.io/v2.0/account/metadata?address=${aa}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getAccountMeta():");
    }

    //------------------------------- Pool (也叫：Market) --------------------------------------------------------------
    getPoolListFromCa = async (
        ca: string,
    ): Promise<any> => {

        let url: string;
        // sort_by可选：created_time, volumes_24h, trades_24h
        const sort_by: string = 'trades_24h';
        const sort_order: string = 'desc';
        const page = 1;
        const page_size = 10;   //只能取值：10、20、30、40、60、100

        // https://pro-api.solscan.io/v2.0/market/list?page=1&page_size=10&token_address=Fiq8K21K62zLFP6q6Wrh7nc4AZJmqoavyTxEX6Bkpump&sort_by=trades_24h&sort_order=desc
        url = `https://pro-api.solscan.io/v2.0/market/list?page=${page}&page_size=${page_size}&token_address=${ca}&sort_by=${sort_by}&sort_order=${sort_order}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getPoolList():");
    }

    getPoolInfoFromPa = async (
        pa: string,
    ): Promise<any> => {

        let url: string;

        // https://pro-api.solscan.io/v2.0/market/info?address=HxLit4BFNwkKgdTbYWTGAVLEsuHadXewV7vT1418Q7QG
        url = `https://pro-api.solscan.io/v2.0/market/info?address=${pa}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getPoolInfo():");
    }

    getPoolVolFromPa = async (
        pa: string,
    ): Promise<any> => {

        let url: string;

        // https://pro-api.solscan.io/v2.0/market/volume?address=HxLit4BFNwkKgdTbYWTGAVLEsuHadXewV7vT1418Q7QG
        url = `https://pro-api.solscan.io/v2.0/market/volume?address=${pa}`;

        return this.getJsonFromUrl_Sol(url, "Error fetching getPoolInfo():");
    }
}
