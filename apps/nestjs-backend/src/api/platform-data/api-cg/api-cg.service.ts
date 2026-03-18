import { Inject, Injectable } from '@nestjs/common';
import { Redis as IoRedis } from 'ioredis';
import { ICgPoolItem, ICgPoolListResponse, IcgTokenItem, IcgTokenListResponse } from "@gr/interface-api/platform-data";
import { AxiosClient } from '@gr/axios-client';
import { isValidQtType } from 'src/utils/api/platform-data/api-cg';

@Injectable()
export class ApiCgService {
    private readonly CG_START_PAGE = 1;
    private readonly CG_MAX_QUERY_PAGE = 4;
    // private readonly MAX_QUERY_ADDRESSES = 30;
    private readonly CG_MAX_QUERY_ADDRESSES = 3;

    private readonly cgAxios: AxiosClient;
    constructor(

        // @Inject('REDIS_CLIENT') protected readonly redisClient: IoRedis,
        private readonly redisClient: IoRedis,

        // 下行是：❗不推荐的写法：构造函数参数中直接赋默认值
        /* 
        为什么不推荐：
            NestJS 的依赖注入机制会尝试解析 constructor 参数，即使 AxiosClient 不是 @Injectable()，Nest 会尝试识别并报错
         */
        // private readonly axios = new AxiosClient({ baseURL: 'https://api.example.com' }),

        // @Inject('AXIOS_BASE_URL') private readonly baseURL: string

    ) {
        /* 
        优点：
            明确，不干扰 Nest 的 DI 分析器
            支持未来替换为注入方式（构造函数参数就是 reserved slot）
            类型推导明确，调试更清晰
         */
        // this.axios = new AxiosClient({ baseURL: 'https://api.example.com' });
        this.cgAxios = new AxiosClient({
            // baseURL: '',    // 不加前缀，使用完整 URL
            baseURL: 'https://api.geckoterminal.com/api/v2',    // 不加前缀，使用完整 URL
            headers: {
                accept: 'application/json',
                // 'x-cg-pro-api-key': API_KEY,
            },
        });
    }

    // 免费版，不用传入API_KEY
    getJsonFromUrlUseFree = async (url: string, errPrint: string): Promise<any> => {
        // const API_KEY = process.env.API_CG_KEY as string;

        console.log("Fetching from URL:", url);

        try {
            // fetch 版
            /* const response = await fetch(url, {
                headers: {
                    accept: "application/json",
                    // "x-cg-pro-api-key": API_KEY,

                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data; */
            // axios 版
            return this.cgAxios.get(url);
        } catch (error) {
            console.error(errPrint, error);
            throw error;
        }
    }
    // 付费升级版，需要传入API_KEY
    getJsonFromUrlUsePro = async (url: string, errPrint: string): Promise<any> => {
        const API_KEY = process.env.API_CG_KEY as string;
        // console.log('API_KEY=', API_KEY)
        console.log("Fetching from URL:", url);

        try {
            const response = await fetch(url, {
                headers: {
                    accept: "application/json",
                    "x-cg-pro-api-key": API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(errPrint, error);
            throw error;
        }
    }

    //------------------------------- Pools --------------------------------------------------------------
    getTrendingPools = async (
        chainType: string,
        duration: string,
    ): Promise<any> => {
        // const chainId = getApiChainId(chainType);
        // const isSolana = chainId === "solana";

        // const maxPage = 1;
        // const startPage = 1;

        // 标准化 duration
        if (!isValidQtType(duration)) {
            duration = "1h";
        }

        // 统一 chainType（支持传入 "sol"）
        if (chainType.toLowerCase() === "sol") {
            chainType = "solana";
        }

        const poolList: ICgPoolItem[] = [];
        const seenBaseTokenIds = new Set<string>();
        const start1 = performance.now();
        for (let page = this.CG_START_PAGE; page <= this.CG_MAX_QUERY_PAGE; page++) {
            // const url = `https://api.geckoterminal.com/api/v2/networks/${chainType}/trending_pools?page=${page}&duration=${duration}`;
            const url = `/networks/${chainType}/trending_pools?page=${page}&duration=${duration}`;

            const poolListResponse: ICgPoolListResponse = await this.getJsonFromUrlUseFree(url, "Error fetching getTrendingPools():");

            for (const item of poolListResponse.data) {
                // 注意，使用：item.relationships.base_token.data.id去重，最后可能会比maxPage*每页返回数少。
                // 因为：item.id才是每个池子的唯一值。而：item.relationships.base_token.data.id去重，每个代币出现多个池子，只加入一次
                const baseTokenId = item.relationships.base_token.data.id;
                // const baseTokenId = item.id;
                if (!seenBaseTokenIds.has(baseTokenId)) {
                    seenBaseTokenIds.add(baseTokenId);
                    poolList.push(item);
                }
            }
        }
        const end1 = performance.now();
        console.log(`await this.getJsonFromUrlUseFree 执行时间: ${(end1 - start1).toFixed(4)} 毫秒`);
        // const url =`https://pro-api.coingecko.com/api/v3/onchain/networks/eth/trending_pools`;
        // 付费版，才能访问：pro-api.coingecko.com
        // 非付费，只能访问：api.coingecko.com
        // const url =`https://api.coingecko.com/api/v3/onchain/networks/${chainType}/trending_pools`;
        // 免费版
        // const url = `https://api.geckoterminal.com/api/v2/networks/${chainType}/trending_pools?page=1&duration=${duration}`;

        // return this.getJsonFromUrlUsePro(url, "Error fetching getTrendingPools():");
        return poolList;
    }

    getNewPools = async (
        chainType: string,
        // duration: string,
    ): Promise<any> => {
        // const chainId = getApiChainId(chainType);
        // const isSolana = chainId === "solana";

        // const maxPage = 3;
        // const startPage = 1;

        // 标准化 duration
        /* if (!isValidDuration(duration)) {
            duration = "1h";
        } */

        // 统一 chainType（支持传入 "sol"）
        if (chainType.toLowerCase() === "sol") {
            chainType = "solana";
        }

        const poolList: ICgPoolItem[] = [];
        const seenBaseTokenIds = new Set<string>();
        const start1 = performance.now();
        for (let page = this.CG_START_PAGE; page <= this.CG_MAX_QUERY_PAGE; page++) {

            // const url = `https://api.geckoterminal.com/api/v2/networks/${chainType}/new_pools?page=${page}`;
            const url = `/networks/${chainType}/new_pools?page=${page}`;
            const poolListResponse: ICgPoolListResponse = await this.getJsonFromUrlUseFree(url, "Error fetching getNewPools():");

            for (const item of poolListResponse.data) {
                // 注意，使用：item.relationships.base_token.data.id去重，最后可能会比maxPage*每页返回数少。
                // 因为：item.id才是每个池子的唯一值。而：item.relationships.base_token.data.id去重，每个代币出现多个池子，只加入一次
                const baseTokenId = item.relationships.base_token.data.id;
                // const baseTokenId = item.id;
                if (!seenBaseTokenIds.has(baseTokenId)) {
                    seenBaseTokenIds.add(baseTokenId);
                    poolList.push(item);
                }
            }
        }
        const end1 = performance.now();
        console.log(`await this.getJsonFromUrlUseFree 执行时间: ${(end1 - start1).toFixed(4)} 毫秒`);

        return poolList;
    }

    getPoolsFromPa = async (
        chainType: string,
        pa: string,
    ): Promise<any> => {
        // 统一 chainType（支持传入 "sol"）
        if (chainType.toLowerCase() === "sol") {
            chainType = "solana";
        }

        const url = `/networks/${chainType}/pools/${pa}`;
        
        // const tokenItemResponse: IcgTokenItemResponse=await this.getJsonFromUrlUseFree(url, "Error fetching getTokenMetaFromCa():");
        return await this.getJsonFromUrlUseFree(url, "Error fetching getPoolsFromPa():");
    }

    getPoolsMultiFromPaArray = async (
        chainType: string,
        paArray: string,
    // ): Promise<any[]> => {
    ): Promise<ICgPoolListResponse> => {
        // 标准化链名
        if (chainType.toLowerCase() === "sol") {
            chainType = "solana";
        }
    
        // 拆分合约地址数组
        const paList = paArray.split(",").map((ca) => ca.trim()).filter(Boolean);
    
        // const BATCH_SIZE = 30;
        // const results: any[] = [];
        const allPoolItem: ICgPoolItem[] = [];
    
        // 按 30 个为一批分批请求
        for (let i = 0; i < paList.length; i += this.CG_MAX_QUERY_ADDRESSES) {
            const batch = paList.slice(i, i + this.CG_MAX_QUERY_ADDRESSES);
            const encodedBatch = encodeURIComponent(batch.join(","));
            
            // https://api.geckoterminal.com/api/v2/networks/eth/pools/multi/0x60594a405d53811d3bc4766596efd80fd545a270%2C0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640
            const url = `/networks/${chainType}/pools/multi/${encodedBatch}`;
    
            try {
                // const batchResult = await this.getJsonFromUrlUseFree(url, "Error fetching getTokenMetaMultiFromCaArray2():");
                const batchResponse: ICgPoolListResponse = await this.getJsonFromUrlUseFree(
                    url,
                    "Error fetching getPoolsMultiFromPaArray():"
                );

                if (Array.isArray(batchResponse.data)) {
                    allPoolItem.push(...batchResponse.data);
                }
            } catch (err) {
                console.error(`Failed to fetch batch [${i}-${i + this.CG_MAX_QUERY_ADDRESSES}]:`, err);
            }
        }
    
        // return results;
        return { data: allPoolItem };
    };

    //------------------------------- Tokens --------------------------------------------------------------

    getTokenMetaFromCa = async (
        chainType: string,
        ca: string,
    ): Promise<any> => {
        // 统一 chainType（支持传入 "sol"）
        if (chainType.toLowerCase() === "sol") {
            chainType = "solana";
        }

        const url = `/networks/${chainType}/tokens/${ca}`;
        // const tokenItemResponse: IcgTokenItemResponse=await this.getJsonFromUrlUseFree(url, "Error fetching getTokenMetaFromCa():");
        return await this.getJsonFromUrlUseFree(url, "Error fetching getTokenMetaFromCa():");
    }

    /* getTokenMetaMultiFromCaArray = async (
        chainType: string,
        caArray: string,
    ): Promise<any> => {
        // 统一 chainType（支持传入 "sol"）
        if (chainType.toLocaleLowerCase() === "sol") {
            chainType = "solana";
        }

        // const url = `/networks/eth/tokens/${caArray}`;
        const url = `/networks/eth/tokens/multi/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2%2C0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`;
        
        return await this.getJsonFromUrlUseFree(url, "Error fetching getTokenMetaFromCa():");
    } */

    getTokenMetaMultiFromCaArray = async (
        chainType: string,
        caArray: string,
    // ): Promise<any[]> => {
    ): Promise<IcgTokenListResponse> => {
        // 标准化链名
        if (chainType.toLowerCase() === "sol") {
            chainType = "solana";
        }
    
        // 拆分合约地址数组
        const caList = caArray.split(",").map((ca) => ca.trim()).filter(Boolean);
    
        // const BATCH_SIZE = 30;
        // const results: any[] = [];
        const allTokenItem: IcgTokenItem[] = [];
    
        // 按 30 个为一批分批请求
        for (let i = 0; i < caList.length; i += this.CG_MAX_QUERY_ADDRESSES) {
            const batch = caList.slice(i, i + this.CG_MAX_QUERY_ADDRESSES);
            const encodedBatch = encodeURIComponent(batch.join(","));
            const url = `/networks/${chainType}/tokens/multi/${encodedBatch}`;
    
            try {
                // const batchResult = await this.getJsonFromUrlUseFree(url, "Error fetching getTokenMetaMultiFromCaArray2():");
                const batchResponse: IcgTokenListResponse = await this.getJsonFromUrlUseFree(
                    url,
                    "Error fetching getTokenMetaMultiFromCaArray():"
                );

                if (Array.isArray(batchResponse.data)) {
                    allTokenItem.push(...batchResponse.data);
                }
            } catch (err) {
                console.error(`Failed to fetch batch [${i}-${i + this.CG_MAX_QUERY_ADDRESSES}]:`, err);
            }
        }
    
        // return results;
        return { data: allTokenItem };
    };

}
