import {
    GR_TIME, getNestedValue,
    mathRound_CmcMillion_d2_n2n,
    // mathRound_d2_n2n, mathRound_ParseFloat_d2_s2n 
} from '@gr/interface-utils';
// import { TQtType } from "@gr/interface-api/uniform-data";
import {
    TChainName, TQtType, TChainQtKey, SUPPORT_QT,
} from "@gr/interface-base";

import {
    IGrTokenSortItem_Client,
    IGrTokenSortItem_Server,
    IHot, TSortField_Server,

    IEvmSafe,
    ISplSafe,
    // SUPPORT_CHAIN,  SUPPORT_QT_FILE_LIST, SUPPORT_QT_CACHE_LIST,
} from "@gr/interface-api/uniform-data";

import { DATA_CLIP } from 'src/constant/DATA_CLIP';
import {
    getQtMaxAge,
    
    
} from 'src/utils/sort/uniform-data/sort-hot_rule_github';
/**
 * 🔥 Token 热度评分系统核心引擎
 * 
 * 实现功能：
 *  - 多时段活跃热度打分（5m/1h/6h/24h）
 *  - 上线时间 & CMC市值打分规则
 *  - 防刷榜机制（低市值降权）
 *  - 热榜实时更新、裁剪、排序重建
 *  - 所有规则配置均可调整，支持人工调参
 *
 * 行数：~400 行核心逻辑，算法可解释性强，评分结果可控
 */

// 刷新热度缓存和排行榜
export function refreshHotMapAndRanking(
    chainName: TChainName,
    hot: Record<TChainQtKey, Map<string, IHot>>,
    hotGrTokenSet: Record<TChainName, Set<string>>,
    hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>>,
    hotGrTokenSortList: Record<TChainQtKey, IGrTokenSortItem_Server[]>,
) {
    for (const qt of SUPPORT_QT) {
        //第一步(之1)：过期清理Map(在map中，移除最新命中时间，超过 maxAgeSeconds 的　key)
        //第一步(之2)：检查是否：当前时间-最后一次清0时间　是否大于 maxAgeSeconds.大于则：l_z_time＝最新时间、并且：l_z_hc=0
        prune_And_ResetZero_HotMap(chainName, qt, hot, hotGrTokenSet, hotGrTokenMap);

        //第二步：过滤高风险 token（避免浪费算力）
        // filterHighRiskToken(chainType, qt, hotGrTokenSet, hotGrTokenMap);

        //第三步：计算活跃交易额
        calculateActiveTradingVolume(chainName, qt, hot, hotGrTokenMap);

        //第四步：过滤系数值超低的Token.需要在calculateActiveTradingVolume->执行后,执行
        // filterLowRiskToken(chainType, qt, hotGrTokenSet, hotGrTokenMap);

        //第五步：重新生成5m/1h/6h/24h的排序结果．
        rebuildSortedList(chainName, qt, `lv_0_hot_vol.${qt}`, 'desc', hot, hotGrTokenMap, hotGrTokenSortList);

        //第六步:超出最大记录数的，删除
        clipHotMap(chainName, qt, hot, hotGrTokenSet, hotGrTokenMap);
    }
}

// 第一步(之1)清理函数(在map中，移除最新命中时间，超过 maxAgeSeconds 的　key)
// 第一步(之2)：检查是否：当前时间-最后一次清0时间　是否大于 maxAgeSeconds.大于则：l_z_time＝最新时间、并且：l_z_hc=0
export function prune_And_ResetZero_HotMap(
    chainName: TChainName,
    qtType: TQtType,
    hot: Record<TChainQtKey, Map<string, IHot>>,
    hotGrTokenSet: Record<TChainName, Set<string>>,
    hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>>,
) {
    const key = `${chainName}_${qtType}` as TChainQtKey;
    const hotMap = hot[key];
    const maxAgeSeconds = getQtMaxAge(qtType);
    const now = Math.floor(Date.now() / 1000);

    let delete_count: number = 0;

    for (const [tokenKey, hotEntry] of hotMap.entries()) {
        if (now - hotEntry.h_time > maxAgeSeconds) {
            //移除：这条链(chainType)的当前时间段(qt)的超时key
            hotMap.delete(tokenKey);

            console.log(`==${delete_count}--移除：这条链(${chainName})的当前时间段(${qtType})的超时(maxAgeSeconds=${maxAgeSeconds})--key=${tokenKey}`);
            delete_count++;
            //如果时间段(qt)是"24h"的超时，需同时要移除：this.hotGrTokenSet[chainType]、this.hotGrTokenMap[chainType] 的对应key
            if (qtType === '24h') {
                hotGrTokenSet[chainName].delete(tokenKey);
                hotGrTokenMap[chainName].delete(tokenKey);
            }
            // 不会被超时移除的，才需要检查是否：当前时间-最后一次清0时间>maxAgeSeconds                        
            // 把l_z_time，超过 maxAgeSeconds 的　[key].l_z_time设置为最新时间，并且：设置[key].l_z_hc＝０
        } else if (now - hotEntry.l_z_time > maxAgeSeconds) {
            hotMap.set(tokenKey, {
                /* 
                    ...hot 的作用解释：是 对象展开（spread）语法，它的作用是：
                        1:把当前 hot 对象中所有已有的字段完整复制到新对象中。

                        2:然后你再指定两个字段：
                            l_z_time: now,
                            l_z_hc: 0
                            这两个字段会 覆盖掉 hot 中原有的 l_z_time 和 l_z_hc 值。

                        3:不能省略...hot
                            除非你明确只要 l_z_time 和 l_z_hc 两个字段，其他字段都不保留。
                */
                ...hotEntry,
                l_z_time: now,
                l_z_hc: 0,
            });
        }
    }//End for
}

// 第二步：
// ✅ 过滤高风险 token（evm 和 sol 链用不同的判定规则）
// ⛔ 会直接从 hotGrTokenMap 和 hotGrTokenSet 中删除不合格 token
export function filterHighRiskToken(
    chainName: TChainName,
    hot: Record<TChainQtKey, Map<string, IHot>>,
    hotGrTokenSet: Record<TChainName, Set<string>>,
    hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>>
) {
    const tokenMap = hotGrTokenMap[chainName];
    const tokenSet = hotGrTokenSet[chainName];

    for (const [tokenAddress, tokenInfo] of tokenMap.entries()) {
        const isHighRisk = isHighRiskToken(chainName, tokenInfo);

        if (isHighRisk) {
            tokenMap.delete(tokenAddress);
            tokenSet.delete(tokenAddress);

            // ⛔ 同时清除所有 qt 下的 hotMap 中的该 token（否则排行榜仍会引用）
            for (const qt of SUPPORT_QT) {
                hot[`${chainName}_${qt}`]?.delete(tokenAddress);
            }
        }
    }
}

// 判定某 token 是否属于高风险（evm 和 sol 用不同逻辑）
function isHighRiskToken(chainName: TChainName, tokenInfo: IGrTokenSortItem_Client): boolean {
    if (chainName === 'sol') {
        if (!tokenInfo.spl_safe) return false;

        const s: ISplSafe = tokenInfo.spl_safe;

        // scam、fake pump/bonk、mint 伪增发、恶意地址、冻结权限
        return (
            s.is_scam === 1 ||
            s.is_fake_pump === 1 ||
            s.is_fake_bonk === 1 ||
            s.is_mint_able === 1 ||
            s.is_freez_able === 1 ||
            s.is_creators_malicious_address === 1
        );
    } else {
        if (!tokenInfo.evm_safe) return false;
        // if (chainType === 'eth' || chainType === 'bsc' || chainType === 'base' || chainType === 'arb') {
        const s: IEvmSafe = tokenInfo.evm_safe;

        // scam、黑名单、高买卖税（税>50%为骗局）、未锁池
        return (
            s.is_scam === 1 ||
            s.is_black_listed === 1 ||
            s.buy_tax >= 50 ||
            s.sell_tax >= 50 ||
            s.is_lp_locked === 0
        );
    }

    return false;
}
// 第三步：计算活跃交易额

export function calculateActiveTradingVolume(
    chainName: TChainName,
    qtType: TQtType,
    hot: Record<TChainQtKey, Map<string, IHot>>,
    hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>>,
) {
    // 定义1：有hotMap：const chainQtType = `${chainType}_${qtType}` as TChainQtKey; const hotMap = hot[chainQtType];
    // 定义2：有遍历：for (const [key, hotEntry] of hotMap.entries()) {...const item = hotGrTokenMap[chainType].get(key);...执行代码...)

    // ----------Token基本信息------------
    // 已知1：item的：5m/1h/6h/24h的交易额存在：item.vol[5m/1h/6h/24h]
    // 已知2：item的：全部交易笔数存在：item.tranx[5m/1h/6h/24h].all_trader
    // 已知3：item的：独立交易笔数存在：item.tranx[5m/1h/6h/24h].ind_trader
    // 已知4：item的：创建时间存在(时间戳,单位：秒)：item.c_t_s
    // 已知5：item的：流通市值存在(时间戳,单位：秒)：item.cmc

    // ----------Token风险信息------------
    // 已知1-evm：item的风险检测存在：item.evm_safe
    // {is_scam:骗局（貔貅）,is_open_source:开源,is_lp_locked:锁池子,
    // buy_tax：买入手续费，sell_tax：卖出手续费，trans_tax：转账手续费,
    // is_ownership_renounced:弃权，is_mintable:增发，is_anti_whale:防巨鲸,
    // is_white_listed:白名单，is_black_listed:黑名单} 
    // 已知1-sol：item的风险检测存在：item.spl_safe
    // {is_mint_discard:Mint丢弃,is_mintable:增发,is_black_listed:黑名单} 

    // ----------Token活跃度信息------------
    // 已知1：item的：独立交易笔数存在：item.tranx[5m/1h/6h/24h].ind_trader
    // 已知2：最近一次清零后:命中的次数存在：hotEntry.l_z_hc
    // 已知3：最近一次:清零时间存在：hotEntry.l_z_time

    // ----------Token 1h 24h变化信息------------
    // 已知1：item的：1h/24h的价格变化信息存在：item.price_change

    // ----------Token Top10持仓信息------------
    // 已知1：item的：持币地址数存在：item.holders.total
    // 已知2：item的：Top10持仓占比存在：item.holders.top10_percent



    // 计算最近活路度系数：
    // 有常量1:　最新时间（秒为单位）：const now = Math.floor(Date.now() / 1000);　
    // 有常量2:　每次采集api的时间间隔为：const get_api_interval = 50; (50秒)
    // 计算最近一次清零时间后，经过了采集api的时间间隔次数：const maxApiCallCount_LastZero = Math.max(1, (now - hotEntry.l_z_time) / get_api_interval); // 防止分母为 0

    // 活跃度系数：const activityScore = hotEntry.l_z_hc/maxApiCallCount_LastZero

    // ----------Token Lv0-2分级参数------------
    // 已知1：item的：lv0-lv2的: 系数存在：item.lv_0_factor/item.lv_1_factor/item.lv_2_factor    
    // 未经计算lv0-lv2的：活跃交易额，均为:-1
    // 实现：将计算后活跃交易额存在：item.lv_0_hot_vol[5m/1h/6h/24h]/item.lv_0_hot_vol[5m/1h/6h/24h]/item.lv_0_hot_vol[5m/1h/6h/24h]

    // 求：活跃交易额：item.h_vol[5m/1h/6h/24h]，未经计算的：item.h_vol[5m/1h/6h/24h]的值，均为:-1
    // item.h_vol[5m/1h/6h/24h]的计算公式：

    const chainQtType = `${chainName}_${qtType}` as TChainQtKey;
    const hotMap = hot[chainQtType];
    // Date.now()：返回的是当前时间的 毫秒级时间戳
    const now = Math.floor(Date.now() / 1000);

    const maxAgeSeconds = getQtMaxAge(qtType);
    const get_api_interval = 50;

    for (const [key, hotEntry] of hotMap.entries()) {
        const item = hotGrTokenMap[chainName].get(key);
        if (item) {
            


            // 计算当前时间段的：活跃交易额
            
            const lv_0_hot_vol = item.vol[qtType];  //注：此计算公式，只是gitHub版，原版计算公式不开源

            //更新item里：h_vol[qt]的值
            /* 
            问题：设置item.h_vol[qt] = h_vol;后，是否需要：this.hotGrTokenMap[chainType].set(key, item)？
            Gpt回答： 不需要，原因： this.hotGrTokenMap[chainType].get(key) 返回的 item 是对象的引用，
            所以你对 item.h_vol[qt] 的修改，会直接反映到 Map 中对应的对象上。
             */
            item.lv_0_hot_vol[qtType] = lv_0_hot_vol;

            // 保存计算公式，仅用于开发时验证
            
        }
    }
}

// 第五步：重新生成5m/1h/6h/24h的排序结果．
// 支持传入指定字段的排序(支持任意字段，并且支持：number、及string类型的：number和iso时间格式)
export function rebuildSortedList(
    chainName: TChainName,
    qtType: TQtType,
    sortField: TSortField_Server,   // 限定只允许: THotSortField 限定的字段
    sortOrder: 'asc' | 'desc',      // 更严格指定，只允许 'asc' 或 'desc'
    hot: Record<TChainQtKey, Map<string, IHot>>,
    hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>>,
    hotGrTokenSortList: Record<TChainQtKey, IGrTokenSortItem_Server[]>,
) {
    const key = `${chainName}_${qtType}` as TChainQtKey;
    const hotMap = hot[key];

    const list = Array.from(hotMap.entries())
        .map(([tokenKey, hot]) => ({
            ...hotGrTokenMap[chainName].get(tokenKey)!,
            hot,
        }))
        .sort((a, b) => {
            const aValue = getNestedValue(a, sortField);
            const bValue = getNestedValue(b, sortField);

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            // fallback: 数字优先，其次字符串，最后默认值
            return 0;
            //降序
            // b.hot[sortField] - a.hot[sortField]);
        });

    hotGrTokenSortList[key] = list;
    console.log(`后:rebuildSortedList=>>hotGrTokenSortList[${key}].length=`, hotGrTokenSortList[key].length);
}

// 第五步：裁剪超出最大记录数的热度数据
/* 
若超过 MAX_RECORDS条,则按照:hot.h_time降序排序,获取前 KEEP_RECORDS条数据,
超过前 KEEP_RECORDS条条数据,则丢弃.实现数据过大时,优先删除最久未被命中的热度数据
 */
export function clipHotMap(
    chainName: TChainName,
    qtType: TQtType,
    hot: Record<TChainQtKey, Map<string, IHot>>,
    hotGrTokenSet: Record<TChainName, Set<string>>,
    hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>>,
) {
    const key = `${chainName}_${qtType}` as TChainQtKey;
    const hotMap = hot[key];
    const currentSize = hotMap.size;

    if (currentSize <= DATA_CLIP[chainName].MAX_RECORDS) return;　// 不处理

    const entries = Array.from(hotMap.entries());

    // 按 hot.h_time 降序排序（最近命中的排前面）
    entries.sort((a, b) => b[1].h_time - a[1].h_time);

    // 保留前 DATA_CLIP[chainType].KEEP_RECORDS条，其余为待删除项
    // slice(DATA_CLIP[chainType].KEEP_RECORDS) 就是从第 KEEP_RECORDS条开始，拿“第 KEEP_RECORDS条以后的所有数据”；
    const toDelete = entries.slice(DATA_CLIP[chainName].KEEP_RECORDS);

    for (const [tokenKey] of toDelete) {
        hotMap.delete(tokenKey);

        // 若是 24h 热度，需同步移除对应的tokenKey
        if (qtType === '24h') {
            hotGrTokenSet[chainName].delete(tokenKey);
            hotGrTokenMap[chainName].delete(tokenKey);
        }
    }

    console.log(`[clipHotMap] ${key} 超出限制：原有 ${currentSize} 条，清除 ${toDelete.length} 条`);
}