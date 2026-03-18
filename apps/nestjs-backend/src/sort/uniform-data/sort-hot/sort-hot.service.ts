import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis as IoRedis } from 'ioredis';
import {
    TTabType_Client,
    TChainName, TQtType, TChainQtKey, SUPPORT_CHAIN, SUPPORT_QT,
    // SUPPORT_QT_FILE_LIST, SUPPORT_QT_CACHE_LIST,
} from "@gr/interface-base";

import {
    IGrTokenSortItem_Client,
    IGrTokenSortItem_Server,
    IHot,
    // TSortField_Server,
    // TSortField_Client,
    IGrTokenSortPageResult_Server,

} from "@gr/interface-api/uniform-data";
import { mathRound_CmcMillion_d2_n2n, mathRound_Min001_d2_n2n } from "@gr/interface-utils";
import { Cron, CronExpression } from '@nestjs/schedule';

import { assign_If_Target_Empty, assign_If_Target_Zero } from 'src/utils/format/format';

import { TimeTaskHelper } from 'src/utils/task/time-task-helper';

import { refreshHotMapAndRanking } from 'src/utils/sort/uniform-data/sort-hot_rank_github';
import { getQtMaxAge } from 'src/utils/sort/uniform-data/sort-hot_rule_github';

import {
    loadMapFromCache, loadMapFromFile,
    persistLogToFile, persistMapToCache, persistMapToFile
} from 'src/utils/sort/uniform-data/sort-hot_persist';

const SAVE_LOG_TO_FILE_CRON = '0-9 58 23 * * *';    //每天23点58分，使用：TimeTaskHelper对cron容错：实现程序在符合的：时、分的第0-9秒，仅执行一次。
const SAVE_MAP_TO_FILE_CRON = '0-9 58 */2 * * *';    //每隔2小时的58分，使用：TimeTaskHelper对cron容错：实现程序在符合的：时、分的第0-9秒，仅执行一次。
const SAVE_MAP_TO_CACHE_CRON = '0-9 1,31 * * * *' //每1小时的第1、31分钟，使用：TimeTaskHelper对cron容错：实现程序在符合的：时、分的第0-9秒，仅执行一次。

const TODO_TEST_TASK_CRON = '0-4 */5 * * * *';   //每5分钟，的前0-4秒，仅执行一次。（用于测试）

const MAP_CACHE_TTL_HOURS_12 = 43200; //备份缓存，只保存12小时。因为超过12小时后，再重启程序：热度统计会严重失真

const CMC_M_LIST_MAX = 144;
//以：秒，为单位
const SEC = 1;
const MIN = 60;
const HOUR = 3600;

/**
 * 规则（144个采样点）：
 * 二维数组：[lteAgeSec, intervalSec]，按 lteAgeSec 递增排序
 */
const CMC_SAMPLE_TABLE_144: [number, number][] = [
    [30 * MIN, 15 * SEC],       // t ≤ 30m            → 每 15 秒   （k-max：0.6 [即：36分钟] 小时）
    [60 * MIN, 30 * SEC],       // 30m < t ≤ 1h       → 每 30 秒   （k-max：1.2小时）
    [2 * HOUR, 1 * MIN],        // 1h  < t ≤ 2h       → 每 1  分钟（k-max：2.4小时）
    [6 * HOUR, 3 * MIN],        // 2h  < t ≤ 6h       → 每 3  分钟（k-max：7.2小时）
    [12 * HOUR, 5 * MIN],       // 6h  < t ≤ 12h      → 每 5  分钟（k-max：12小时）    
    // 兜底最大值（10分钟 * 144点=覆盖 24 小时）
    // Infinity === Number.POSITIVE_INFINITY // true
    [Infinity, 10 * MIN],       // t > 12h            → 每 10 分钟（k-max：24小时）
];


/** 根据 token 上线时间与当前时间差，返回下一次应采样的“间隔秒数”（表驱动，≤ 右闭） */
export function getCmcSampleIntervalSec(c_t_sec: number, nowSec: number): number {
    // 保护：输入异常/时钟漂移时，至少按 1 秒
    // const t = Math.max(1, (nowSec | 0) - (c_t_sec | 0));

    // t: 上线距离现在的秒数
    const t = nowSec - c_t_sec;

    for (const [lteAgeSec, intervalSec] of CMC_SAMPLE_TABLE_144) {
        if (t <= lteAgeSec) return intervalSec;
    }
    // 理论上不会到这里（已用 +∞ 兜底）
    return 30 * MIN;
}

/**
 * 工具函数：在两个采样点之间插入线性插值的中间点（不包含端点）
 *
 * 逻辑说明：
 * - 当 passed >= 2 且 prev > 0 时，表示需要在 prev 和 next 之间插入 (passed - 1) 个中间点；
 * - 采用线性插值公式：v_i = prev + (next - prev) * ((i+1)/passed)，i ∈ [0, passed-2]
 * - 生成的点按顺序 push 进 arr，不包含端点 prev/next
 * - next 的 push 动作应由调用方在本函数之后执行
 *
 * @param arr    数组，用于存放采样结果，会在末尾追加中间点
 * @param prev   上一个采样点（已存在于 arr 中的最后一个值）
 * @param next   当前采样点（目标值）
 * @param passed 经过的区间数（包含当前点），需 >= 2 才会触发插值
 */
function pushLinearMidPoints(
    arr: number[],
    prev: number,
    next: number,
    passed: number,
) {
    if (!(passed >= 2 && prev > 0)) return;
    // 中间点个数
    const midCount = passed - 1;

    for (let i = 0; i < midCount; i++) {
        // 中间第 i 个点（i: 0..midCount-1）
        // v_i = prev + (cmc_m - prev) * ((i + 1) / passed)
        const t = (i + 1) / passed;
        const vi = mathRound_Min001_d2_n2n(prev + (next - prev) * t);
        arr.push(vi);
    }
}


@Injectable()
export class SortHotService implements OnModuleInit {
    // private ddDo_Finished:boolean = false;
    // private lastExecutedMinute: string | null = null;
    private readonly LOG_FILE_PATH = process.env.LOG_FILE_PATH as string;
    private readonly MAP_FILE_PATH = process.env.MAP_FILE_PATH as string;

    // 启动时，是否从：文件加载Map
    private readonly LOAD_MAP_FROM_FILE: Record<TChainName, boolean> = {
        // SPL
        sol: false,

        // EVM
        eth: false,
        bsc: false,
        base: false,
        aval: false,
        arb: false,
        linea: false,
        pulse: false,
        polygon: false,
        optimism: false,
        moonbeam: false,
        gnosis: false,
        ronin: false,
        fantom: false,
        cronos: false,
        lisk: false,
        chiliz: false,
        blast: false,
        sonic: false,
        hyper: false,
        sei: false,
        uni: false,
        "x-layer": false,

        // TVM
        tron: false,

        // FVM
        flow: false,

        // TAO
        bittensor: false,

        // Move
        sui: false,
        aptos: false,
    };


    // 启动时，是否从：IoRedis加载Map
    private readonly LOAD_MAP_FROM_CACHE: Record<TChainName, boolean> = {
        // SPL
        sol: true,

        // EVM
        eth: true,
        bsc: false,
        base: false,
        aval: false,
        arb: false,
        linea: false,
        pulse: false,
        polygon: false,
        optimism: false,
        moonbeam: false,
        gnosis: false,
        ronin: false,
        fantom: false,
        cronos: false,
        lisk: false,
        chiliz: false,
        blast: false,
        sonic: false,
        hyper: false,
        sei: false,
        uni: false,
        "x-layer": false,

        // TVM
        tron: false,

        // FVM
        flow: false,

        // TAO
        bittensor: false,

        // Move
        sui: false,
        aptos: false,
    };


    private readonly TAB_TYPE_CLIENT: TTabType_Client = 'hot';
    private readonly TOKEN_MAP_FILE_NAME = 'tokenMap';

    private readonly hotGrTokenSet: Record<TChainName, Set<string>> = {
        // SPL
        sol: new Set(),

        // EVM
        eth: new Set(),
        bsc: new Set(),
        base: new Set(),
        aval: new Set(),
        arb: new Set(),
        linea: new Set(),
        pulse: new Set(),
        polygon: new Set(),
        optimism: new Set(),
        moonbeam: new Set(),
        gnosis: new Set(),
        ronin: new Set(),
        fantom: new Set(),
        cronos: new Set(),
        lisk: new Set(),
        chiliz: new Set(),
        blast: new Set(),
        sonic: new Set(),
        hyper: new Set(),
        sei: new Set(),
        uni: new Set(),
        "x-layer": new Set(),

        // TVM
        tron: new Set(),

        // FVM
        flow: new Set(),

        // TAO
        bittensor: new Set(),

        // Move
        sui: new Set(),
        aptos: new Set(),
    };

    private readonly hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>> = {
        // SPL
        sol: new Map(),

        // EVM
        eth: new Map(),
        bsc: new Map(),
        base: new Map(),
        aval: new Map(),
        arb: new Map(),
        linea: new Map(),
        pulse: new Map(),
        polygon: new Map(),
        optimism: new Map(),
        moonbeam: new Map(),
        gnosis: new Map(),
        ronin: new Map(),
        fantom: new Map(),
        cronos: new Map(),
        lisk: new Map(),
        chiliz: new Map(),
        blast: new Map(),
        sonic: new Map(),
        hyper: new Map(),
        sei: new Map(),
        uni: new Map(),
        "x-layer": new Map(),

        // TVM
        tron: new Map(),

        // FVM
        flow: new Map(),

        // TAO
        bittensor: new Map(),

        // Move
        sui: new Map(),
        aptos: new Map(),
    };


    private readonly hotGrTokenSortList: Record<TChainQtKey, IGrTokenSortItem_Server[]> = {
        // SPL
        sol_5m: [], sol_1h: [], sol_6h: [], sol_24h: [],

        // EVM
        eth_5m: [], eth_1h: [], eth_6h: [], eth_24h: [],
        bsc_5m: [], bsc_1h: [], bsc_6h: [], bsc_24h: [],
        base_5m: [], base_1h: [], base_6h: [], base_24h: [],
        aval_5m: [], aval_1h: [], aval_6h: [], aval_24h: [],
        arb_5m: [], arb_1h: [], arb_6h: [], arb_24h: [],
        linea_5m: [], linea_1h: [], linea_6h: [], linea_24h: [],
        pulse_5m: [], pulse_1h: [], pulse_6h: [], pulse_24h: [],
        polygon_5m: [], polygon_1h: [], polygon_6h: [], polygon_24h: [],
        optimism_5m: [], optimism_1h: [], optimism_6h: [], optimism_24h: [],
        moonbeam_5m: [], moonbeam_1h: [], moonbeam_6h: [], moonbeam_24h: [],
        gnosis_5m: [], gnosis_1h: [], gnosis_6h: [], gnosis_24h: [],
        ronin_5m: [], ronin_1h: [], ronin_6h: [], ronin_24h: [],
        fantom_5m: [], fantom_1h: [], fantom_6h: [], fantom_24h: [],
        cronos_5m: [], cronos_1h: [], cronos_6h: [], cronos_24h: [],
        lisk_5m: [], lisk_1h: [], lisk_6h: [], lisk_24h: [],
        chiliz_5m: [], chiliz_1h: [], chiliz_6h: [], chiliz_24h: [],
        blast_5m: [], blast_1h: [], blast_6h: [], blast_24h: [],
        sonic_5m: [], sonic_1h: [], sonic_6h: [], sonic_24h: [],
        hyper_5m: [], hyper_1h: [], hyper_6h: [], hyper_24h: [],
        sei_5m: [], sei_1h: [], sei_6h: [], sei_24h: [],
        uni_5m: [], uni_1h: [], uni_6h: [], uni_24h: [],
        "x-layer_5m": [], "x-layer_1h": [], "x-layer_6h": [], "x-layer_24h": [],

        // TVM
        tron_5m: [], tron_1h: [], tron_6h: [], tron_24h: [],

        // FVM
        flow_5m: [], flow_1h: [], flow_6h: [], flow_24h: [],

        // TAO
        bittensor_5m: [], bittensor_1h: [], bittensor_6h: [], bittensor_24h: [],

        // Move
        sui_5m: [], sui_1h: [], sui_6h: [], sui_24h: [],
        aptos_5m: [], aptos_1h: [], aptos_6h: [], aptos_24h: [],
    };

    private readonly hot: Record<TChainQtKey, Map<string, IHot>> = {
        // SPL
        sol_5m: new Map(), sol_1h: new Map(), sol_6h: new Map(), sol_24h: new Map(),

        // EVM
        eth_5m: new Map(), eth_1h: new Map(), eth_6h: new Map(), eth_24h: new Map(),
        bsc_5m: new Map(), bsc_1h: new Map(), bsc_6h: new Map(), bsc_24h: new Map(),
        base_5m: new Map(), base_1h: new Map(), base_6h: new Map(), base_24h: new Map(),
        aval_5m: new Map(), aval_1h: new Map(), aval_6h: new Map(), aval_24h: new Map(),
        arb_5m: new Map(), arb_1h: new Map(), arb_6h: new Map(), arb_24h: new Map(),
        linea_5m: new Map(), linea_1h: new Map(), linea_6h: new Map(), linea_24h: new Map(),
        pulse_5m: new Map(), pulse_1h: new Map(), pulse_6h: new Map(), pulse_24h: new Map(),
        polygon_5m: new Map(), polygon_1h: new Map(), polygon_6h: new Map(), polygon_24h: new Map(),
        optimism_5m: new Map(), optimism_1h: new Map(), optimism_6h: new Map(), optimism_24h: new Map(),
        moonbeam_5m: new Map(), moonbeam_1h: new Map(), moonbeam_6h: new Map(), moonbeam_24h: new Map(),
        gnosis_5m: new Map(), gnosis_1h: new Map(), gnosis_6h: new Map(), gnosis_24h: new Map(),
        ronin_5m: new Map(), ronin_1h: new Map(), ronin_6h: new Map(), ronin_24h: new Map(),
        fantom_5m: new Map(), fantom_1h: new Map(), fantom_6h: new Map(), fantom_24h: new Map(),
        cronos_5m: new Map(), cronos_1h: new Map(), cronos_6h: new Map(), cronos_24h: new Map(),
        lisk_5m: new Map(), lisk_1h: new Map(), lisk_6h: new Map(), lisk_24h: new Map(),
        chiliz_5m: new Map(), chiliz_1h: new Map(), chiliz_6h: new Map(), chiliz_24h: new Map(),
        blast_5m: new Map(), blast_1h: new Map(), blast_6h: new Map(), blast_24h: new Map(),
        sonic_5m: new Map(), sonic_1h: new Map(), sonic_6h: new Map(), sonic_24h: new Map(),
        hyper_5m: new Map(), hyper_1h: new Map(), hyper_6h: new Map(), hyper_24h: new Map(),
        sei_5m: new Map(), sei_1h: new Map(), sei_6h: new Map(), sei_24h: new Map(),
        uni_5m: new Map(), uni_1h: new Map(), uni_6h: new Map(), uni_24h: new Map(),
        "x-layer_5m": new Map(), "x-layer_1h": new Map(), "x-layer_6h": new Map(), "x-layer_24h": new Map(),

        // TVM
        tron_5m: new Map(), tron_1h: new Map(), tron_6h: new Map(), tron_24h: new Map(),

        // FVM
        flow_5m: new Map(), flow_1h: new Map(), flow_6h: new Map(), flow_24h: new Map(),

        // TAO
        bittensor_5m: new Map(), bittensor_1h: new Map(), bittensor_6h: new Map(), bittensor_24h: new Map(),

        // Move
        sui_5m: new Map(), sui_1h: new Map(), sui_6h: new Map(), sui_24h: new Map(),
        aptos_5m: new Map(), aptos_1h: new Map(), aptos_6h: new Map(), aptos_24h: new Map(),
    };


    constructor(
        private readonly redisClient: IoRedis,
    ) {

    }

    /* 
    onModuleInit 其实是 NestJS 的生命周期钩子 名字，不能随便改名字
    框架约定调用：当 NestJS 创建好这个服务实例，
    并且它依赖的所有依赖项（依赖注入的其他服务）都初始化完毕后，
    就会自动调用 onModuleInit()。
     */
    async onModuleInit() {
        for (const chain of SUPPORT_CHAIN) {
            let loadSuccess = false;
            //1: 优先从缓存加载
            if (this.LOAD_MAP_FROM_CACHE[chain]) {
                console.log('从IoRedis加载Map');
                //返回加载状态给:loadSuccess
                loadSuccess = await loadMapFromCache(
                    this.redisClient,
                    chain,
                    this.hotGrTokenSet,
                    this.hotGrTokenMap,
                    this.hot,
                );
            }

            //2: 若从Redis加载失败,并且允许从文件加载
            if (loadSuccess === false && this.LOAD_MAP_FROM_FILE[chain]) {
                console.log('从文件加载Map');
                //返回加载状态给:loadSuccess
                loadSuccess = await loadMapFromFile(
                    this.MAP_FILE_PATH,
                    this.TAB_TYPE_CLIENT,
                    this.TOKEN_MAP_FILE_NAME,
                    chain,
                    this.hotGrTokenSet,
                    this.hotGrTokenMap,
                    this.hot,
                );
            }

            //3: 从File/Cache加载成功后,还需要对Map的过期清理及重新生成排序结果
            if (loadSuccess) {
                //刷新热度缓存和排行榜
                // this.refreshHotMapAndRanking(chain);
                refreshHotMapAndRanking(
                    chain,
                    this.hot,
                    this.hotGrTokenSet,
                    this.hotGrTokenMap,
                    this.hotGrTokenSortList,
                );
            }
        }
    }

    @Cron(TODO_TEST_TASK_CRON)
    async toDo_Test() {
        await TimeTaskHelper.executeOncePerMinuteFromCron(
            'toDo_Test',
            TODO_TEST_TASK_CRON,
            async () => {
                console.log('[toDo_Test] 执行时间:', new Date().toISOString());
                // await this.saveLogToDisk();
            },
        );
    }

    // （每天23:58）定时保存日志--到磁盘[注意:只用于后续统计分析,不参与数据恢复]
    // @Cron('0 */2 * * *')
    @Cron(SAVE_LOG_TO_FILE_CRON) // 每天 23:58 执行
    async saveLogToFile() {
        await TimeTaskHelper.executeOncePerMinuteFromCron(
            'saveLogToFile',
            SAVE_LOG_TO_FILE_CRON,
            async () => {
                await persistLogToFile(
                    this.LOG_FILE_PATH,
                    this.TAB_TYPE_CLIENT,
                    this.TOKEN_MAP_FILE_NAME,
                    this.hotGrTokenMap,
                    this.hot,
                );
            },
        );
    }

    // 每两小时的第 58 分，只执行一次:保存到文件【参与：程序启动时，数据恢复】
    @Cron(SAVE_MAP_TO_FILE_CRON)
    async saveMapToFile() {
        await TimeTaskHelper.executeOncePerMinuteFromCron(
            'saveMapToFile',
            SAVE_MAP_TO_FILE_CRON,
            async () => {
                await persistMapToFile(
                    this.MAP_FILE_PATH,
                    this.TAB_TYPE_CLIENT,
                    this.TOKEN_MAP_FILE_NAME,
                    this.hotGrTokenMap,
                    this.hot,
                );
            },
        );
    }

    // 每小时的 1 分 和 31 分，整点执行一次:保存到缓存【参与：程序启动时，数据恢复】
    @Cron(SAVE_MAP_TO_CACHE_CRON)
    async saveMapToCache() {
        await TimeTaskHelper.executeOncePerMinuteFromCron(
            'saveMapToCache',
            SAVE_MAP_TO_CACHE_CRON,
            async () => {
                await persistMapToCache(
                    this.redisClient,
                    this.hotGrTokenMap,
                    this.hot,
                    MAP_CACHE_TTL_HOURS_12,
                );
            },
        );
    }

    // 由：TaskGrService->getGrTokenSortItem_v2调用：sortHotService.updateGrTokenSortItems
    // 实现：从api获取的结果更新到：sortHotService
    public updateGrTokenSortItems(
        chainName: TChainName,
        grTokenSortItems: IGrTokenSortItem_Client[]
    ) {
        console.log('updateGrTokenSortItems=>>grTokenSortItems.length=', grTokenSortItems.length);
        console.log('前:updateGrTokenSortItems=>>this.hotGrTokenSet[chain].size=', this.hotGrTokenSet[chainName].size);
        console.log('前:updateGrTokenSortItems=>>this.hotGrTokenMap[chain].size=', this.hotGrTokenMap[chainName].size);

        //第一步：遍历：grTokenSortItems，更新 hotGrTokenMap
        for (const item of grTokenSortItems) {
            this.hit_And_Update_Record(chainName, item);
        }

        console.log('后:updateGrTokenSortItems=>>this.hotGrTokenSet[chain].size=', this.hotGrTokenSet[chainName].size);
        console.log('后:updateGrTokenSortItems=>>this.hotGrTokenMap[chain].size=', this.hotGrTokenMap[chainName].size);

        //刷新热度缓存和排行榜        
        refreshHotMapAndRanking(
            chainName,
            this.hot,
            this.hotGrTokenSet,
            this.hotGrTokenMap,
            this.hotGrTokenSortList,
        );
    }

    //给外部访问的．获取指定chainType，qt的排序结果
    public getChainQtHotGrTokenSortList(
        chainName: TChainName,
        qtType: TQtType,
        pageStr: string,
        // ): IGrTokenSortItem_Server[] {
    ): IGrTokenSortPageResult_Server {
        const pageSize = 30;
        // const page = parseInt(pageStr, 10);
        // const page = Math.max(parseInt(pageStr, 10) || 1, 1);

        // 若pageStr,是非数字string,则取默认第1页
        const rawPage = parseInt(pageStr, 10);
        const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;

        const key = `${chainName}_${qtType}` as TChainQtKey;
        const fullList = this.hotGrTokenSortList[key] || [];

        // 计算最大页数：Math.ceil() 是向上取整
        const maxPage = Math.ceil(fullList.length / pageSize);
        // 支持默认第一页，可以把 if (isNaN(page) || page < 1) 改成：
        /* if (isNaN(page) || page < 1) {
            return [];
        } */

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        // 这里,如果:endIndex >=fullList.length会怎么样
        // Gpt: 如果 endIndex 超出数组长度，Array.prototype.slice() 会自动裁剪到数组末尾；
        //      所以即使 endIndex >= fullList.length，也只是返回到最后一项，不会抛异常。
        // return fullList.slice(startIndex, endIndex);
        return {
            maxPage,
            list: fullList.slice(startIndex, endIndex),
        };
    }

    // 主动更新热度命中
    private hit_And_Update_Record(chainName: TChainName, item: IGrTokenSortItem_Client) {
        const key = `${item.ca}`;
        const nowSec = Math.floor(Date.now() / 1000);

        // cmc_m是要取：item.cmc的市值，以100万为单位的。保留2位小数，若cmc_m小于0.01则取0.01
        const cmc_m = mathRound_CmcMillion_d2_n2n(item.cmc);

        // let update_count:number=0;
        // let add_count:number=0;
        if (this.hotGrTokenSet[chainName].has(key)) {

            const oldItem = this.hotGrTokenMap[chainName].get(key);
            if (oldItem) {
                // 合并旧的 关键字段（如果新值：item．*** 为:空/0）
                assign_If_Target_Empty(item, 'name', oldItem.name);
                assign_If_Target_Empty(item, 'symbol', oldItem.symbol);
                assign_If_Target_Empty(item, 'image_url', oldItem.image_url);
                assign_If_Target_Empty(item, 'price', oldItem.price);

                assign_If_Target_Zero(item.holders, 'total', oldItem.holders.total);
                assign_If_Target_Zero(item, 'fdv', oldItem.fdv);
                assign_If_Target_Zero(item, 'cmc', oldItem.cmc);
                assign_If_Target_Zero(item.liq, 'single_liq', oldItem.liq.single_liq);

                // ---------- 维护 cmc_m_list / cmc_m_l_u_sec ----------
                // 先默认沿用旧值，避免未到点时被空覆盖
                item.cmc_m_arr = oldItem.cmc_m_arr || [];
                item.cmc_m_l_u_sec = oldItem.cmc_m_l_u_sec ?? -1;

                // 计算采样间隔（秒）
                const intervalSec = getCmcSampleIntervalSec(item.c_t_sec, nowSec);


                // 未初始化 (item.cmc_m_l_u_sec === -1) 和
                // 到期更新 ((nowSec - item.cmc_m_l_u_sec) >= intervalSec) 两种情况合并成一个判断 doUpdate 来做
                const doUpdate: boolean =
                    (item.cmc_m_l_u_sec === -1) ||
                    ((nowSec - item.cmc_m_l_u_sec) >= intervalSec);

                if (doUpdate) {

                    const arr = item.cmc_m_arr ?? [];

                    // arr.shift() 会删除数组的第一个元素（也就是最旧的那个采样值），从而给新值腾位置。

                    // 原先这个用法是：arr.length就删除，第一个
                    // if (arr.length >= 48) arr.shift();

                    // 裁剪到 （一次性删除多余的前缀）
                    /* 
                     array.splice(start, deleteCount, item1, item2, ...);
                    start：表示要修改的起始索引位置（从0计数）。
                    deleteCount：表示要删除的元素数量。如果为0，则不删除任何元素。
                    item1, item2, ...：要插入到数组的元素。
                     */

                    // === 首次初始化：直接 push 当前点（不做插值） ===
                    if (item.cmc_m_l_u_sec === -1 || arr.length === 0) {

                        // 裁剪到 144（一次性删除多余的前缀）
                        if (arr.length >= CMC_M_LIST_MAX) {
                            arr.splice(0, arr.length - (CMC_M_LIST_MAX - 1));
                        }
                        arr.push(cmc_m); // cmc_m 已由 mathRound_CmcMillion_d2_n2n 处理为两位小数
                        item.cmc_m_arr = arr;
                        item.cmc_m_l_u_sec = nowSec;
                    } else {
                        // === 非首次：根据间隔补齐缺失点（线性插值），再追加当前点 ===
                        const diffSec = nowSec - item.cmc_m_l_u_sec;

                        // 本次应新增的点数（包含当前这一次的点）
                        // 例：diffSec=3800, interval=1800
                        // => passed = 2 => 需补 1 个中间点 + 1 个当前点
                        const passed = Math.floor(diffSec / intervalSec);

                        if (passed >= 1) {
                            // 先按将要新增的数量做一次性裁剪，避免 push 后再次裁剪
                            const needTrim = Math.max(0, arr.length + passed - CMC_M_LIST_MAX);
                            if (needTrim > 0) arr.splice(0, needTrim);

                            const prev = arr[arr.length - 1];

                            // 线性插值--pushLinearMidPoints函数，只插补中间点
                            // 只在有“上一个有效值”时才做（避免未初始化/异常值误差）
                            pushLinearMidPoints(arr, prev, cmc_m, passed);

                            // 末尾追加当前点
                            arr.push(cmc_m);

                            item.cmc_m_arr = arr;
                            item.cmc_m_l_u_sec = nowSec;
                        }
                        // else: passed === 0 理论上不会进到这里（由 doUpdate 保证）
                    }
                }
            }

            console.log(`==>>更新：这条链(${chainName})的key=>>key=${key}`);

        } else {
            //不存在，则添加到: this.hotGrTokenSet[chain]
            this.hotGrTokenSet[chainName].add(key);
            console.log(`==++新增：这条链(${chainName})的key=>>key=${key}`);
        }

        // 无论是否合并，最终都将最新的item set到map        
        this.hotGrTokenMap[chainName].set(key, item);

        for (const qt of SUPPORT_QT) {
            const hotMap = this.hot[`${chainName}_${qt}` as TChainQtKey];
            this.updateHot(hotMap, key, nowSec);
        }
    }

    private updateHot(hotMap: Map<string, IHot>, key: string, now: number) {
        const existing = hotMap.get(key);  // 返回 Map 中该 key 对应的 对象引用
        if (existing) {
            existing.hc++;  //总命中次数+1
            // existing.current_hc++;  //当前时间段，命中次数+1
            existing.l_z_hc++;  //当前时间段，命中次数+1
            existing.h_time = now;   //更新最新命中时间
        } else {
            hotMap.set(key, {
                hc: 1,
                // current_hc: 1,
                l_z_hc: 1,
                l_z_time: now,
                i_time: now,
                h_time: now,
            });
        }
    }
}//End Class
//-----------------------------------------------------------------------------

