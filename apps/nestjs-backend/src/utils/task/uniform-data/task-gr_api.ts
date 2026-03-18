import { Redis as IoRedis } from 'ioredis';
import {TChainName, TQtType, TTabType_Server} from "@gr/interface-base";
import { IGrTokenSortItem_Client } from '@gr/interface-api/uniform-data';
import { CACHE_KEY_HEAD, CACHE_KEY_MIDDLE } from 'src/constant/CACHE_KEY';
import { getFullPath_3_Param_Fast } from 'src/utils/path';
import { isValidQtType } from 'src/utils/api/platform-data/api-cg';
import { ApiGrService } from 'src/api/uniform-data/api-gr/api-gr.service';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { isArray } from 'util';

export async function getTaskGrToken_fromApi(
    chainName: TChainName,
    tabType: TTabType_Server,
    pageStr: string,
    qtType: TQtType,
    apiGrService: ApiGrService,
    // redisClient: IoRedis,    
    // ): IGrTokenSortItem[]{
): Promise<IGrTokenSortItem_Client[]> {
    // 标准化 tabType
    if (tabType === CACHE_KEY_MIDDLE.TRENDING_POOLS && !isValidQtType(qtType)) {
        qtType = "5m";
    }

    // const grTokenSortItem: IGrTokenSortItem[] = await this.apiGrService.getSelPools(chainType, tabType, String(this.current_page_new_sol), "");
    const grTokenSortItem: IGrTokenSortItem_Client[] = await apiGrService.getSelPools(chainName, tabType, pageStr, qtType);

    return grTokenSortItem;
    // const grTokenSortItem: IGrTokenSortItem[] = [];


    /* if (tabType === CACHE_KEY_MIDDLE.NEW_POOLS) {
        cacheKeyMiddle = CACHE_KEY_MIDDLE.NEW_POOLS;
    } else if (tabType === CACHE_KEY_MIDDLE.TRENDING_POOLS) {
        cacheKeyMiddle = CACHE_KEY_MIDDLE.TRENDING_POOLS;
    } */

}

export async function merge_1_And_2(
    /* chainType: string,
    tabType: TTabType,
    // pageStr: string,
    duration: string, */
    value_1: IGrTokenSortItem_Client[] | string,
    value_2: IGrTokenSortItem_Client[] | string,
    redisClient: IoRedis | null,
    // value_3: IGrTokenSortItem[],
): Promise<IGrTokenSortItem_Client[]> {

    //若传入的，只有一个数组，长度大于0。则直接返回。不用执行后面的合并
    if (Array.isArray(value_1) && value_1.length === 0) {
        // value_1 是空数组
        return value_2 as IGrTokenSortItem_Client[];
    } else if (Array.isArray(value_2) && value_2.length === 0) {
        // value_2 是空数组
        return value_1 as IGrTokenSortItem_Client[];
    }

    // 判断，是否需要读取缓存
    if (typeof value_1 === "string" && redisClient!==null) {
        const cached_1 = await redisClient.get(value_1);
        if (!isNil(cached_1)) {
            value_1 = JSON.parse(cached_1);
        } else {
            value_1 = [];
        }
    };
    
    if (typeof value_2 === "string" && redisClient!==null) {
        const cached_2 = await redisClient.get(value_2);
        if (!isNil(cached_2)) {
            value_2 = JSON.parse(cached_2);
        } else {
            value_2 = [];
        }
    };



    // 合并逻辑：value_1 在前，value_2 在后，去重（排除 value_2 中 ca 重复的项）
    /* 
        Set 用来快速查重 value_1[].ca
        filter 排除掉 value_2[] 中那些 ca 已经出现在 value_1[] 里的项

        保证合并顺序是：value_1 → value_2
        最后清空并覆盖 value_3 的内容（保持传入引用有效）
     */
    const caSet1 = new Set((value_1 as IGrTokenSortItem_Client[]).map(item => item.ca));
    const filteredValue2 = (value_2 as IGrTokenSortItem_Client[]).filter(item => !caSet1.has(item.ca));

    /* const merged = [...(value_1 as IGrTokenSortItem[]), ...filteredValue2];

    // 更新 value_3 的内容
    value_3.length = 0;
    value_3.push(...merged);

    return value_3; */

    return [...(value_1 as IGrTokenSortItem_Client[]), ...filteredValue2];

    /* const cacheKeyHead = CACHE_KEY_HEAD.GET_TASK_GR;
    const cacheKeyMiddle: TTabType = tabType;
    const cacheFullPath = getFullPath_3_Param_Fast(cacheKeyHead, chainType, cacheKeyMiddle);
    const payload = JSON.stringify(grTokenSortItem);
    // this.redisClient.setex(cacheFullPath, ttl, payload).catch(err => {
    redisClient.set(cacheFullPath, payload).catch(err => {
        console.error(`Redis setex error for ${cacheFullPath}`, err);
    }); */

}