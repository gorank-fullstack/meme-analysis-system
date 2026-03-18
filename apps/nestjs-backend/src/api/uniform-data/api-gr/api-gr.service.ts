import { Injectable } from '@nestjs/common';
import { Redis as IoRedis } from 'ioredis';
import { TChainName, TQtType, TTabType_Server } from "@gr/interface-base";
import {
    ICgPoolItem,
} from "@gr/interface-api/platform-data";
import { IGrTokenSortItem_Client } from "@gr/interface-api/uniform-data";
import { AxiosClient } from '@gr/axios-client';
import { isValidQtType } from 'src/utils/api/platform-data/api-cg';
import { init_Map_Cg_PoolList_To_Gr_TokenList } from 'src/utils/api/uniform-data/api-gr_token_init';

import { get_Cg_poolList } from 'src/utils/api/platform-data/api-cg';
// import { get_Gp_ChainTypeToId_Map } from 'src/utils/platform-safe/gp_safe_data';
// import { IGpEvmTokenSecurityResponse, IGpSplTokenSecurityResponse } from '@gr/interface/platform-safe';

import {
    // combine_Gp_TokenSecurity_To_Gr_Token,
    fetch_Gp_TokenSecurity_From_Api,
    fetch_MoEvm_TokenMeta_From_Api,
    fetch_SolSpl_TokenMeta_From_Api,
    // load_MoEvm_Or_SolSpl_TokenMeta_From_Redis,
    // load_Gp_TokenSecurity_From_Redis,
    // write_Gp_TokenSecurity_To_Redis,
    // write_MoEvm_Or_SolSpl_TokenMeta_To_Redis,
    // combine_MoEvm_Or_SolSpl_TokenMeta_To_Gr_Token
} from 'src/utils/api/uniform-data/api-gr_api';
import {
    // combine_Gp_TokenSecurity_To_Gr_Token,
    // fetch_Gp_TokenSecurity_From_Api,
    // fetch_MoEvm_TokenMeta_From_Api,
    // fetch_SolSpl_TokenMeta_From_Api,
    load_MoEvm_Or_SolSpl_TokenMeta_From_Redis,
    load_Gp_TokenSecurity_From_Redis,
    write_Gp_TokenSecurity_To_Redis,
    write_MoEvm_Or_SolSpl_TokenMeta_To_Redis,
    // combine_MoEvm_Or_SolSpl_TokenMeta_To_Gr_Token
} from 'src/utils/api/uniform-data/api-gr_redis';
import {
    combine_Gp_TokenSecurity_To_Gr_Token,
    // fetch_Gp_TokenSecurity_From_Api,
    // fetch_MoEvm_TokenMeta_From_Api,
    // fetch_SolSpl_TokenMeta_From_Api,
    // load_MoEvm_Or_SolSpl_TokenMeta_From_Redis,
    // load_Gp_TokenSecurity_From_Redis,
    // write_Gp_TokenSecurity_To_Redis,
    // write_MoEvm_Or_SolSpl_TokenMeta_To_Redis,
    combine_MoEvm_Or_SolSpl_TokenMeta_To_Gr_Token
} from 'src/utils/api/uniform-data/api-gr_token_set';

import { CACHE_KEY_HEAD, CACHE_KEY_MIDDLE } from 'src/constant/CACHE_KEY';
import { API_REQUEST_BATCH_SIZE, API_REQUEST_PARAM_USE_INDEX, API_REQUEST_SEPARATOR } from 'src/constant/API_REQUEST';
import { API_PAGE_NEW_POOLS } from 'src/constant/API_PAGE';

@Injectable()
export class ApiGrService {
    /* private readonly CG_EVM_START_PAGE = API_NEW_PAGE.CG_EVM_START_PAGE;
    private readonly CG_EVM_MAX_PAGE = API_NEW_PAGE.CG_EVM_MAX_PAGE;
    private readonly CG_SPL_MAX_PAGE = API_NEW_PAGE.CG_SPL_MAX_PAGE; */

    private readonly CG_MAX_QUERY_ADDRESSES = 30;
    // private readonly CG_MAX_QUERY_ADDRESSES = 3;

    // 对于内部实例（Axios、工具类等） → 在类内部 private 声明后在 constructor 中初始化即可
    private readonly cgAxios: AxiosClient;  //调用 cg平台api的axios
    private readonly moAxios: AxiosClient;  //调用 mo平台api的axios
    private readonly solAxios: AxiosClient;  //调用 sol平台api的axios
    private readonly gpAxios: AxiosClient;  //调用 gp平台api的axios

    // 私有成员变量 getJson_Gr
    // private readonly getJson_Gr: (url: string, errMsg: string) => Promise<any>,
    private readonly getJson_Mo: (url: string, errMsg: string) => Promise<any>;
    private readonly getJson_Sol: (url: string, errMsg: string) => Promise<any>;
    private readonly getJson_Cg: (url: string, errMsg: string) => Promise<any>;
    private readonly getJson_Gp: (url: string, errMsg: string) => Promise<any>;
    constructor(

        // @Inject('REDIS_CLIENT') protected readonly redisClient: IoRedis,
        // DeepSeek:像 redisClient 这样的外部服务，应通过构造函数注入，以提升可测试性和可维护性。
        // Gpt:对于外部依赖（Redis、数据库、服务类等） → 使用构造函数注入 constructor(private readonly dep: Type)
        private readonly redisClient: IoRedis,

    ) {
        /* getJson_Mo只在构造函数中绑定一次
        后续需要用到：this.getJsonFromUrl_Mo.bind(this) 的地方，直接用：getJson_Mo，就可以．
         */
        this.getJson_Mo = this.getJsonFromUrl_Mo.bind(this);
        this.getJson_Sol = this.getJsonFromUrl_Sol.bind(this);
        this.getJson_Cg = this.getJsonFromUrlUseFree_Cg.bind(this);
        this.getJson_Gp = this.getJsonFromUrl_Gp.bind(this);

        //cg平台api的axios的初始化
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
                accept: "application/json",
                // accept: "application/json;version=20230203",
                // 'x-cg-pro-api-key': API_KEY,
            },
        });


        //mo平台api的axios的初始化
        const API_MO_KEY = process.env.API_MO_KEY as string;
        this.moAxios = new AxiosClient({
            baseURL: '',    // 不加前缀，使用完整 URL
            headers: {
                accept: "application/json",
                "X-API-Key": API_MO_KEY,
            },
        });

        //sol平台api的axios的初始化
        const API_SOL_KEY = process.env.API_SOL_KEY as string;
        this.solAxios = new AxiosClient({
            baseURL: '',    // 不加前缀，使用完整 URL            
            headers: {
                accept: "application/json",
                "token": API_SOL_KEY,
            },
        });

        //gp平台api的axios的初始化
        this.gpAxios = new AxiosClient({
            // baseURL: '',    // 不加前缀，使用完整 URL
            baseURL: 'https://api.gopluslabs.io/api/v1',    // 不加前缀，使用完整 URL
            headers: {
                accept: "*/*",
                // accept: 'application/json',
                // 'x-cg-pro-api-key': API_KEY,
            },
        });

    }//end constructor

    getJsonFromUrl_Mo = async (url: string, errPrint: string): Promise<any> => {
        console.log("getJsonFromUrl_Mo->moAxios.get URL:", url);
        try {
            // axios 版
            // return this.moAxios.get(url);
            const res = await this.moAxios.get(url);
            // return res.data; // ✅ 只返回 JSON 数据部分
            // Mo平台,一徤返回完整的数据.
            // 因为Mo平台,有的api是返回:带.data
            // 有的比如evm链的metadata,返回的是直接数组,不带.data
            if (res !== null) {
                return res;
            }

            //获取网络数据失败
            return null;
        } catch (error) {
            console.error(errPrint, error);
            throw error;
        }
    }

    getJsonFromUrl_Sol = async (url: string, errPrint: string): Promise<any> => {
        console.log("getJsonFromUrl_Sol->solAxios.get URL:", url);
        try {
            // axios 版
            // return this.solAxios.get(url);
            const res = await this.solAxios.get(url);
            if (res !== null) {
                return res.data; // ✅ 只返回 JSON 数据部分
            }

            //获取网络数据失败
            return null;

        } catch (error) {
            console.error(errPrint, error);
            throw error;
        }
    }

    // 免费版，不用传入API_KEY
    getJsonFromUrlUseFree_Cg = async (url: string, errPrint: string): Promise<any> => {
        console.log("getJsonFromUrlUseFree_Cg->cgAxios.get URL:", url);
        try {
            // axios 版
            // return this.cgAxios.get(url);
            const res = await this.cgAxios.get(url);
            // console.log('Is array:', Array.isArray(res.data));
            // console.log("getJsonFromUrlUseFree_Cg->res.data:", res.data);
            if (res !== null) {
                return res.data; // ✅ 只返回 JSON 数据部分
            }

            //获取网络数据失败
            return null;

        } catch (error) {
            console.error(errPrint, error);
            throw error;
        }
    }

    getJsonFromUrl_Gp = async (url: string, errPrint: string): Promise<any> => {
        console.log("getJsonFromUrl_Gp->gpAxios.get URL:", url);
        try {
            // axios 版
            // return this.gpAxios.get(url);    //注意，这里：// ⚠️ 返回的是 AxiosResponse 对象，不是 JSON 字符串
            const res = await this.gpAxios.get(url);
            // console.log("getJsonFromUrl_Gp->res.data:", res.data);
            // return res.data; // ✅ 只返回 JSON 数据部分

            // 注意:gp平台返回的json里,没有data字段
            // gp sol链:返回参考:https://api.gopluslabs.io/api/v1/solana/token_security?contract_addresses=FY7EieWUE7ifbQoABC73w6bxjuRtc53PdJAnojQ3pump
            // console.log("getJsonFromUrl_Gp->res:", res);
            if (res !== null) {
                return res;
            }

            //获取网络数据失败
            return null;
        } catch (error) {
            console.error(errPrint, error);
            throw error;
        }
    }
    //------------------------------- Pools --------------------------------------------------------------
    getSelPools = async (
        chainName: TChainName,
        tabType: TTabType_Server,
        pageStr: string,
        qtType: TQtType,
        // ): Promise<any> => {
    ): Promise<IGrTokenSortItem_Client[]> => {
        // 标准化 qtType
        if (tabType === CACHE_KEY_MIDDLE.TRENDING_POOLS && !isValidQtType(qtType)) {
            qtType = "5m";
        }

        // const grTokenSortList: IGrTokenSortItem[] = [];//返回的是自定义的IGrTokenSortItem列表
        // = [];         //访问api获取到的ICgPoolItem列表

        // const now = Math.floor(Date.now() / 1000);

        const start1 = performance.now();

        const page = parseInt(pageStr);

        let startPage: number = 1;
        let endPage: number = 1;

        let limit_max_page: number = 1;

        if (chainName === "sol") {
            startPage = API_PAGE_NEW_POOLS.CG_SPL_START_PAGE;
            endPage = API_PAGE_NEW_POOLS.CG_SPL_MAX_PAGE;

            limit_max_page = API_PAGE_NEW_POOLS.CG_SPL_MAX_PAGE;
        } else {
            startPage = API_PAGE_NEW_POOLS.CG_EVM_START_PAGE;
            endPage = API_PAGE_NEW_POOLS.CG_EVM_MAX_PAGE;

            limit_max_page = API_PAGE_NEW_POOLS.CG_EVM_MAX_PAGE;
        }

        /* 
        减少后端程序刚启动的时，频繁调用对速度有高限制的api
        (比如:cg、gp接口．每分钟上，只能调30)
         */
        //　如果要查询的页码，不超过最大查询页码．则只查询这一页
        // 若：要查询的页码，超过最大查询页码．则查询从：this.CG_START_PAGE 至 this.CG_MAX_QUERY_PAGE多页
        if (page <= limit_max_page) {
            startPage = page;
            endPage = page;
        }

        //------------【第一部分(之一): 获取：CgPoolList
        const poolList: ICgPoolItem[] = await get_Cg_poolList(
            chainName,
            tabType,
            startPage,
            endPage,
            qtType,
            this.getJson_Cg
        );
        const end1 = performance.now();
        console.log(`await this.getJsonFromUrlUseFree_Cg 执行时间: ${(end1 - start1).toFixed(4)} 毫秒`);

        //------------【第一部分(之二): 将返回的：CgPoolList加工为： grTokenSortList
        const grTokenSortList: IGrTokenSortItem_Client[] = init_Map_Cg_PoolList_To_Gr_TokenList(poolList, chainName);

        // map_AddressWithout_TokenSecurity_To_CreateTime记录：无法从缓存读取到：TokenSecurity信息的Map<ca, token创建时间>
        const map_AddressWithout_TokenSecurity_To_CreateTime: Map<string, number> = new Map<string, number>();

        // map_AddressWithout_TokenMeta_To_CreateTime记录：无法从缓存读取到：TokenMeta信息的Map<ca, token创建时间>
        const map_AddressWithout_TokenMeta_To_CreateTime: Map<string, number> = new Map<string, number>();

        //------------【第二部分(之一): 遍历每个 token，尝试读取 Redis 缓存作为 TokenSecurity】************************------------
        /* 
        遍历 tokenListRes.data[] 中的每个 token，尝试用 address 去 Redis 中获取缓存；
        如果 cached 存在（一般是 JSON 字符串），就将其解析后设置为该 token 的 TokenSecurity。
         */
        // 从缓存加载--TokenSecurity
        // const addressWithoutCache = await this.loadMetaFromRedis(
        const addressWithout_TokenSecurity_inRedis = await load_Gp_TokenSecurity_From_Redis(
            // tokenListRes.data,
            grTokenSortList,
            this.redisClient,
            map_AddressWithout_TokenSecurity_To_CreateTime,
            CACHE_KEY_HEAD.SJ_GET_API_GP,
            CACHE_KEY_MIDDLE.TOKEN_SECURITY,
            // CACHE_KEY_HEAD_FROM_SOL_SOL_TOKEN_META
            // CACHE_KEY_HEAD.GET_GP_CHAINTYPE_TOKEN_SECURITY_CAARRAY
        );

        //------------【第二部分(之二): 向 GoPlus API 请求 TokenSecurity 信息，存入：Map<string, any>
        //------------注意：GoPlus Api限制，每次只能请求一个token的　TokenSecurity信息。
        //------------虽然参数是：addresses复数，但实际传多个地址，只返回数组中第一个地址的TokenSecurity信息------------
        const tokenSecurityMap = await fetch_Gp_TokenSecurity_From_Api(
            chainName,
            addressWithout_TokenSecurity_inRedis,
            this.getJson_Gp,
        );

        console.log('>>>addressWithout_TokenSecurity_inRedis.length=', addressWithout_TokenSecurity_inRedis.length);
        console.log('>>>tokenSecurityMap.size=', tokenSecurityMap.size);
        //------------【第二部分(之三): 遍历：tokenSecurityMap ,并根据 token 的创建时间动态获得 Ttl，写入缓存  ------------
        // await this.writeMetaToRedis(metaMap, this.redisClient, CACHE_KEY_HEAD, now);
        await write_Gp_TokenSecurity_To_Redis(
            chainName,

            tokenSecurityMap,
            this.redisClient,
            map_AddressWithout_TokenSecurity_To_CreateTime,
            CACHE_KEY_HEAD.SJ_GET_API_GP,
            CACHE_KEY_MIDDLE.TOKEN_SECURITY,
        );

        //------------【第二部分(之四): 合并 TokenSecurity 到 grTokenSortList　-----------        
        combine_Gp_TokenSecurity_To_Gr_Token(
            chainName,
            grTokenSortList,
            tokenSecurityMap,
        );

        //------------【第三部分(之一): 遍历每个 token，尝试读取 Redis 缓存作为 Token Meta】************************------------
        // 从缓存加载--TokenSecurity
        // const addressWithoutCache = await this.loadMetaFromRedis(
        const addressWithout_MoEvm_Or_SolSpl_TokenMeta_inRedis = await load_MoEvm_Or_SolSpl_TokenMeta_From_Redis(
            // tokenListRes.data,
            grTokenSortList,
            this.redisClient,
            map_AddressWithout_TokenMeta_To_CreateTime,
            CACHE_KEY_HEAD.SJ_GET_API_MO,
            CACHE_KEY_HEAD.SJ_GET_API_SOL,
            CACHE_KEY_MIDDLE.TOKEN_META,
            // CACHE_KEY_HEAD_FROM_SOL_SOL_TOKEN_META
            // CACHE_KEY_HEAD.GET_GP_CHAINTYPE_TOKEN_SECURITY_CAARRAY
        );

        //------------【第三部分(之二): 按 BATCH_SIZE 向 Sol/Mo API 请求 TokenMeta 信息，存入：Map<string, any>
        let tokenMetaMap: Map<string, any> = new Map<string, any>();

        if (chainName === "sol") {
            tokenMetaMap = await fetch_SolSpl_TokenMeta_From_Api(
                /* chainType, */
                addressWithout_MoEvm_Or_SolSpl_TokenMeta_inRedis,
                // apiParamUseIndex_SolSpl: boolean,
                API_REQUEST_PARAM_USE_INDEX.TOKEN_META_MULTI_SOL_SPL,
                // separatorStr_SolSpl: string,
                API_REQUEST_SEPARATOR.TOKEN_META_MULTI_SOL_SPL,
                // batchSize_SolSpl: number,
                API_REQUEST_BATCH_SIZE.TOKEN_META_MULTI_SOL_SPL,
                this.getJson_Sol,
            );
        } else {
            tokenMetaMap = await fetch_MoEvm_TokenMeta_From_Api(
                chainName,
                addressWithout_MoEvm_Or_SolSpl_TokenMeta_inRedis,
                // apiParamUseIndex_MoEvm: boolean,
                API_REQUEST_PARAM_USE_INDEX.TOKEN_META_MULTI_MO_EVM,
                // separatorStr_MoEvm_Head: string,
                API_REQUEST_SEPARATOR.TOKEN_META_MULTI_MO_EVM_HEAD,
                // separatorStr_MoEvm_Last: string,
                API_REQUEST_SEPARATOR.TOKEN_META_MULTI_MO_EVM_LAST,
                // batchSize_MoEvm: number,
                API_REQUEST_BATCH_SIZE.TOKEN_META_MULTI_MO_EvM,
                this.getJson_Mo,
            );
        }

        //------------【第三部分(之三): 遍历：TokenMetaMap ,并根据 token 的创建时间动态获得 Ttl，写入缓存  ------------
        await write_MoEvm_Or_SolSpl_TokenMeta_To_Redis(
            chainName,

            tokenMetaMap,
            this.redisClient,
            // map_AddressWithout_TokenSecurity_To_CreateTime,
            map_AddressWithout_TokenMeta_To_CreateTime,
            /* CACHE_KEY_HEAD.GET_GP,
            CACHE_KEY_MIDDLE.TOKEN_SECURITY, */
            CACHE_KEY_HEAD.SJ_GET_API_MO,
            CACHE_KEY_HEAD.SJ_GET_API_SOL,
            CACHE_KEY_MIDDLE.TOKEN_META,
        );

        //------------【第三部分(之四): 合并 TokenMeta 到 grTokenSortList　-----------        
        combine_MoEvm_Or_SolSpl_TokenMeta_To_Gr_Token(
            chainName,
            grTokenSortList,
            tokenMetaMap,
        );
        // 

        //------------通过 solScan.io 的Trans信息，识别Pump/Bonk 发射检测（仅 sol）　-----------   
        if (chainName === "sol") {
            /* 
            // map_AddressWithout_SolSplTranx_To_CreateTime记录：无法从(内存&&缓存)读取到：SolSplTranx信息的Map<ca, token创建时间>
            const map_AddressWithout_SolSplTrans_To_CreateTime: Map<string, number> = new Map<string, number>();
            //------------ 【第四部分(之一): 遍历每个 token，尝试读取 hotMap内存 作为 Tranx  ------------
            const addressWithout_Trans_inMemoryOrRedis = await load_Gp_SolSplTrans_From_Memory(
                
                grTokenSortList,
                // this.redisClient,
                map_AddressWithout_SolSplTrans_To_CreateTime,
                // CACHE_KEY_HEAD.SJ_GET_API_GP,
                // CACHE_KEY_MIDDLE.TOKEN_SECURITY,
                
            );
            //------------ 【第四部分(之二): 遍历每个 token，尝试读取 Redis 缓存作为 Tranx  ------------
            // 若在:redix能读取到：Trans，则相应移除：addressWithout_Trans_inMemoryOrRedis 里对应的key=ca
            await load_Gp_SolSplTrans_From_Redis(
                addressWithout_Trans_inMemoryOrRedis,
                grTokenSortList,
                this.redisClient,
                map_AddressWithout_SolSplTrans_To_CreateTime,
                CACHE_KEY_HEAD.SJ_GET_API_GP,
                CACHE_KEY_MIDDLE.TOKEN_SECURITY,
                
            ); */
        }
        // return poolList;
        return grTokenSortList;
    }
}
