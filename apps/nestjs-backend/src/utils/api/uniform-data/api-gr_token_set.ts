import {
    ICgPoolItem,
    IMoEvmTokenMeta,
    ISolSplTokenItem,
    ISolSplTokenMetaResponse,
    // ICgPoolListResponse, IcgTokenItem, IcgTokenListResponse 
} from "@gr/interface-api/platform-data";
import {
    IRawGpEvmTokenSecurityResponse,
    IRawGpSplTokenSecurityResponse, IRawGpSplTokenSecurityInfo,
    IRawGpEvmTokenSecurityInfo
} from "@gr/interface-api/platform-safe";
import { ICommonSafe, IDev, IEvmSafe, IGrTokenSortItem_Client, IMeta, ISplSafe, ITransactions } from "@gr/interface-api/uniform-data";
import {
    get_GpEvm_Holders_Top10_Percent, get_GpSpl_Holders_Top10_Percent,
    // has_GpSpl_BlacklistHookNow, 
    is_GpEvm_LpLocked_fast,
    // is_GpEvm_LpLocked_old, is_GpEvm_OwnershipRenounced_v1, 
    is_GpEvm_OwnershipRenounced_v2, is_GpEvm_ScamToken_v1,
    // is_GpSpl_Mintable 
} from "../platform-safe/api-gp_safe_data";
import { assign_If_Target_Empty, assign_If_Target_NegOne, assign_If_Target_Zero, isEmpty, isNotEmpty } from "../../format/format";
// import { isNil } from "@nestjs/common/utils/shared.utils";

import {
    mathRound_ParseFloat_d2_s2n, mathCut_ParseInt_s2n,
    mathRound_d2_n2n, mathRound_Percent_d2_s2n, parseNumberOrZero,
    //  toCmcMillion 
} from '@gr/interface-utils';
// import { get_CgSpl_Pool_isPump } from "src/utils/api/platform-data/api-cg";
import { T3State } from "@gr/interface-base";
import { toLowerTrim } from "@gr/interface-utils";

import {
    hasKeys, toT3, toT3From_Presence,
    // toT3From_Status, 
    toT3From_Status_Authority, toT3From_Status_MetadataUpgradeAuthority
} from "@gr/interface-base";
// import { getAddress } from "ethers"; // ethers v5/v6 都有
export function set_SolSpl_TokenMeta_To_Gr_Token(
    solSplTokenItem: ISolSplTokenItem,
    grTokenSortItem: IGrTokenSortItem_Client,
) {
    // const nowSec = Math.floor(Date.now() / 1000);
    //补全，缺失的信息
    if (solSplTokenItem.icon) {
        assign_If_Target_Empty(grTokenSortItem, 'image_url', solSplTokenItem.icon);  //此函数内：'image_url'　第1次检查
    }

    assign_If_Target_Empty(grTokenSortItem, 'name', solSplTokenItem.name);
    assign_If_Target_Empty(grTokenSortItem, 'symbol', solSplTokenItem.symbol);

    const holder_count = mathCut_ParseInt_s2n(solSplTokenItem.holder.toString());

    // holder_count > 0，并且：tokenItem.gr_cache_t_sec的时间是:最新的,才更新
    if (holder_count > 0 && solSplTokenItem.gr_cache_t_sec > grTokenSortItem.update_state.holders_total_l_u_sec) {
        grTokenSortItem.holders.total = holder_count;
        grTokenSortItem.update_state.holders_total_l_u_sec = solSplTokenItem.gr_cache_t_sec;
    }

    // solSplTokenItem.market_cap有值，并且：solSplTokenItem.gr_cache_t_sec的时间是:最新的,才更新
    if (isNotEmpty(solSplTokenItem.market_cap) && solSplTokenItem.gr_cache_t_sec > grTokenSortItem.update_state.cmc_l_u_sec) {
        grTokenSortItem.cmc = mathCut_ParseInt_s2n(solSplTokenItem.market_cap?.toString());
        grTokenSortItem.update_state.cmc_l_u_sec = solSplTokenItem.gr_cache_t_sec;
    }

    assign_If_Target_Empty(grTokenSortItem.dev, 'creator_aa', solSplTokenItem.creator);
    assign_If_Target_Empty(grTokenSortItem.spl_safe!, 'create_tx', solSplTokenItem.create_tx);

    assign_If_Target_Empty(grTokenSortItem, 'price', solSplTokenItem.price?.toString());
    // assign_If_Target_Empty(token.price_change, '24h', tokenItem.price_change_24h?.toString());
    assign_If_Target_Zero(grTokenSortItem.price_change, '24h', solSplTokenItem.price_change_24h);
    // assign_If_Target_Zero(token, 'cmc', tokenItem.market_cap);

    //solScan返回的:格式:"created_time": 1706172863,
    const c_time_second = solSplTokenItem.created_time;

    assign_If_Target_Zero(grTokenSortItem, 'c_t_sec', c_time_second);

    if (c_time_second !== undefined && c_time_second !== null && c_time_second !== 0) {
        const c_time_iso_str = new Date(c_time_second * 1000).toISOString();
        assign_If_Target_Empty(grTokenSortItem, 'c_t_iso', c_time_iso_str);
    }

    // freeze_authority
    //若：is_mint_able等于-1时，表示还没在goPlus获得数据。使用从solScan获得的：安全数据填补
    if (grTokenSortItem.spl_safe?.is_mint_able === -1) {
        //不可增发
        if (solSplTokenItem.mint_authority === null) {
            grTokenSortItem.spl_safe.is_mint_able = 0;
        }
    }

    //若：is_freez_able等于-1时，表示还没在goPlus获得数据。使用从solScan获得的：freeze_authority数据填补
    if (grTokenSortItem.spl_safe?.is_freez_able === -1) {
        if (solSplTokenItem.freeze_authority === null) {
            grTokenSortItem.spl_safe.is_freez_able = 0;
        }
    }

    //tokenItem.metadata不是未定义，才执行
    // 如果 tokenItem.metadata 是 undefined、null、false 等假值，会跳过内部逻辑。
    if (solSplTokenItem.metadata) {

        //补全，缺失的links
        assign_If_Target_Empty(grTokenSortItem.meta, 'x', solSplTokenItem.metadata.twitter);
        assign_If_Target_Empty(grTokenSortItem.meta, 'tg', solSplTokenItem.metadata.telegram);
        assign_If_Target_Empty(grTokenSortItem.meta, 'site', solSplTokenItem.metadata.website);

        assign_If_Target_Empty(grTokenSortItem, 'image_url', solSplTokenItem.metadata.image);  //此函数内：'image_url'　第2次检查(使用不同的：字段源)

        // 注意：solscan返回的："metadata"->"createdOn",只能存入：possible_created_on，不能直接用于判断：是否由pump或bonk发射        
        // 因为："metadata"是可以由用户在创建token时填的

        // 以下if判断作废--需改由：
        // 通过判断创建：token的create_tx 的 Program Id 确认这个token是否在:pump/bonk发射过，还是：假冒在：:pump/bonk发射
        if (solSplTokenItem.metadata.createdOn) {
            const createOn = toLowerTrim(solSplTokenItem.metadata.createdOn);

            //保存:由 pump.fun / bonk.fun 创建的可能性。
            if (createOn.endsWith("pump.fun")) {
                grTokenSortItem.spl_safe!.possible_created_on = "pump";
            } else if (createOn.endsWith("bonk.fun")) {
                grTokenSortItem.spl_safe!.possible_created_on = "bonk";
            }
        }

        //如果有：twitter | telegram | website ,标记为有媒体
        if (isNotEmpty(grTokenSortItem.meta.x) || isNotEmpty(grTokenSortItem.meta.tg) || isNotEmpty(grTokenSortItem.meta.site)) {
            grTokenSortItem.other_state.is_has_links = 1;
        }
    }
}

export function set_MoEvm_TokenMeta_To_Gr_Token(
    moEvmTokenItem: IMoEvmTokenMeta,
    grTokenSortItem: IGrTokenSortItem_Client,
) {
    // const nowSec = Math.floor(Date.now() / 1000);

    //补全，缺失的信息
    assign_If_Target_Empty(grTokenSortItem, 'image_url', moEvmTokenItem.logo);      //此函数内：'image_url'　第1次检查
    assign_If_Target_Empty(grTokenSortItem, 'image_url', moEvmTokenItem.thumbnail); //此函数内：'image_url'　第2次检查
    assign_If_Target_Empty(grTokenSortItem, 'name', moEvmTokenItem.name);
    assign_If_Target_Empty(grTokenSortItem, 'symbol', moEvmTokenItem.symbol);

    assign_If_Target_Zero(grTokenSortItem, 'fdv', mathCut_ParseInt_s2n(moEvmTokenItem.fully_diluted_valuation));

    // mo的TokenMeta，没有返回：holders.total。这里不需要判断，是否需要补全    
    // moEvmTokenItem.market_cap有值，并且：moEvmTokenItem.gr_cache_t_sec的时间是:最新的,才更新
    if (isNotEmpty(moEvmTokenItem.market_cap) && moEvmTokenItem.gr_cache_t_sec > grTokenSortItem.update_state.cmc_l_u_sec) {
        grTokenSortItem.cmc = mathCut_ParseInt_s2n(moEvmTokenItem.market_cap);
        grTokenSortItem.update_state.cmc_l_u_sec = moEvmTokenItem.gr_cache_t_sec;
    }

    //MoralisIo返回的:格式:"created_at": "2025-05-21T21:40:35.000Z",,
    const c_time_iso = moEvmTokenItem.created_at;
    assign_If_Target_Empty(grTokenSortItem, 'c_t_iso', c_time_iso);

    if (c_time_iso !== undefined && c_time_iso !== null && c_time_iso !== "") {
        // 创建 Date 实例（会自动解析为 UTC 时间）
        const c_time_date = new Date(c_time_iso);
        // 获取 Unix 时间戳（毫秒），转换为秒
        const c_time_sec = Math.floor(c_time_date.getTime() / 1000);
        assign_If_Target_Zero(grTokenSortItem, 'c_t_sec', c_time_sec);
    }

    //若：possible_spam等于-1时，表示还没被查出来．
    if (grTokenSortItem.evm_safe?.is_scam === -1) {
        if (!isEmpty(moEvmTokenItem.possible_spam)) {
            grTokenSortItem.evm_safe.is_scam = moEvmTokenItem.possible_spam === true ? 1 : 0;
        }
    }

    //若：is_open_source等于-1时，表示还没被查出来．
    if (grTokenSortItem.evm_safe?.is_open_source === -1) {
        if (!isEmpty(moEvmTokenItem.verified_contract)) {
            grTokenSortItem.evm_safe.is_open_source = moEvmTokenItem.verified_contract === true ? 1 : 0;
        }
    }

    //tokenItem.links不是未定义，才执行
    if (moEvmTokenItem.links) {
        //补全，缺失的links
        assign_If_Target_Empty(grTokenSortItem.meta, 'x', moEvmTokenItem.links.twitter);
        assign_If_Target_Empty(grTokenSortItem.meta, 'tg', moEvmTokenItem.links.telegram);
        assign_If_Target_Empty(grTokenSortItem.meta, 'site', moEvmTokenItem.links.website);

        //如果有：twitter | telegram | website ,标记为有媒体
        if (isNotEmpty(grTokenSortItem.meta.x) || isNotEmpty(grTokenSortItem.meta.tg) || isNotEmpty(grTokenSortItem.meta.site)) {
            grTokenSortItem.other_state.is_has_links = 1;
        }
    }
}

/**
 * 将 GoPlus 的 SPL 安全检测结果，映射到 token.spl_safe
 * 仅使用 GoPlus 能提供/推导出的字段；诸如 create_tx / is_pump / is_bonk / is_fake_* 等来自其他数据源的字段不覆盖
 */
export function set_GpSpl_TokenSecurity_To_Gr_Token(
    rawGpSplTokenSecurityParsed: IRawGpSplTokenSecurityResponse,
    token: IGrTokenSortItem_Client,
) {
    if (!rawGpSplTokenSecurityParsed?.result) return;
    const ca = token.ca;
    if (!ca) return;

    const gpSplTokenSecurityInfo: IRawGpSplTokenSecurityInfo = rawGpSplTokenSecurityParsed.result[ca];
    if (!gpSplTokenSecurityInfo) return;

    // 统一批次时间（避免每个 item 差几毫秒/秒）
    // const nowSec = Math.floor(Date.now() / 1000);
    // ;

    //============ 先补全：不在spl_safe对象的信息 ============
    //token.symbol缺失，则补上
    // 补 token.symbol（若 token.symbol 为空,且gpSplTokenSecurityInfo.metadata?.symbol有值）
    assign_If_Target_Empty(token, 'symbol', gpSplTokenSecurityInfo.metadata?.symbol);

    // gpSplTokenSecurityInfo.holder_count有值，并且：gpSplTokenSecurityInfo.gr_cache_t_sec的时间是:最新的,才更新
    if (isNotEmpty(gpSplTokenSecurityInfo.holder_count) && gpSplTokenSecurityInfo.gr_cache_t_sec > token.update_state.holders_total_l_u_sec) {
        token.holders.total = mathCut_ParseInt_s2n(gpSplTokenSecurityInfo.holder_count);
        token.update_state.holders_total_l_u_sec = gpSplTokenSecurityInfo.gr_cache_t_sec;
    }


    //token.dev.creator_aa缺失，则补上
    if (Array.isArray(gpSplTokenSecurityInfo.creators) &&
        gpSplTokenSecurityInfo.creators.length > 0) {
        assign_If_Target_Empty(token.dev, 'creator_aa', gpSplTokenSecurityInfo.creators[0].address);
    }

    //给：holders.total 和  token.holders.top10_percent 赋值
    token.holders.total = mathCut_ParseInt_s2n(gpSplTokenSecurityInfo.holder_count);
    if (Array.isArray(gpSplTokenSecurityInfo.holders) &&
        gpSplTokenSecurityInfo.holders.length > 0) {
        token.holders.top_10_percent = mathRound_d2_n2n(get_GpSpl_Holders_Top10_Percent(gpSplTokenSecurityInfo.holders) * 100);
    }

    // 其实能进入到这函数，spl_safe已经不可能为 null了。
    /* 
    若：spl_safe为 null，则初始化
    if (!token.spl_safe) {
        token.spl_safe = {} as ISplSafe;
    } */
    //============ 然后再补全：在spl_safe对象的信息 ============
    normalize_Spl_Security_Info(gpSplTokenSecurityInfo, token.spl_safe!);
}

/**
 * 将原始的 GoPlus SPL Token 安全检测信息（宽松类型）
 * 归一化为业务内部的 ISplSafe（稳定 -1 | 0 | 1 值）
 */
export function normalize_Spl_Security_Info(
    rawGpSplTokenSecurityInfo: IRawGpSplTokenSecurityInfo,
    splSafe: ISplSafe
): ISplSafe {
    // ==== creators 恶意地址推导 ====
    if (Array.isArray(rawGpSplTokenSecurityInfo.creators)) {
        if (
            // .some() 会在数组里逐个检查元素，一旦有一个元素满足条件就返回 true。
            // .some() 这一行的逻辑是：creators 数组里是否存在至少一个恶意创建者。
            rawGpSplTokenSecurityInfo.creators.some(
                c => c.malicious_address === 1 || c.malicious_address === '1'
            )
        ) {
            splSafe.is_creators_malicious_address = 1;
        } else {
            splSafe.is_creators_malicious_address = 0;
        }
    } else {
        splSafe.is_creators_malicious_address = -1; // 未知更合理
    }

    // ==== 合约控制权限类风险 ====
    splSafe.is_balance_mutable_authority = toT3From_Status_Authority(rawGpSplTokenSecurityInfo.balance_mutable_authority);
    splSafe.is_clos_able = toT3From_Status_Authority(rawGpSplTokenSecurityInfo.closable);

    // default_account_state:"0" 默认可用；"1" 默认冻结/需额外操作；异常值会走 toT3 -> -1
    splSafe.is_default_account_state = toT3(rawGpSplTokenSecurityInfo.default_account_state);
    splSafe.is_default_account_state_upgradable = toT3From_Status_Authority(rawGpSplTokenSecurityInfo.default_account_state_upgradable);
    splSafe.is_freez_able = toT3From_Status_Authority(rawGpSplTokenSecurityInfo.freezable);

    // 注意，metadata_mutable的字段格式是："metadata_mutable": {"metadata_upgrade_authority": [],"status": "0"},
    // key字段名与其他，不同：需要调用独立函数：toT3From_Status_MetadataUpgradeAuthority
    splSafe.is_metadata_mutable = toT3From_Status_MetadataUpgradeAuthority(rawGpSplTokenSecurityInfo.metadata_mutable);

    splSafe.is_mint_able = toT3From_Status_Authority(rawGpSplTokenSecurityInfo.mintable);

    // ==== 手续费 / Hook 等隐藏成本 ====
    // transfer_fee: {} 为空对象 => 无手续费；有键 => 存在手续费    
    splSafe.is_transfer_fee = toT3From_Presence(hasKeys(rawGpSplTokenSecurityInfo.transfer_fee));
    splSafe.is_transfer_fee_upgradable = toT3From_Status_Authority(rawGpSplTokenSecurityInfo.transfer_fee_upgradable);

    // transfer_hook: [] 空数组 => 无 Hook；有元素 => 存在 Hook
    splSafe.is_transfer_hook = toT3From_Presence(
        Array.isArray(rawGpSplTokenSecurityInfo.transfer_hook) &&
        rawGpSplTokenSecurityInfo.transfer_hook.length > 0
    );

    splSafe.is_transfer_hook_upgradable = toT3From_Status_Authority(rawGpSplTokenSecurityInfo.transfer_hook_upgradable);

    // ==== 黑名单（只要存在：转账钓子（hook），或者：转账钓子可以升级，均视为存在黑名单） ====
    // sol链，以安全出名，留有这些后门，就是高风险。
    if ((Array.isArray(rawGpSplTokenSecurityInfo.transfer_hook) &&
        rawGpSplTokenSecurityInfo.transfer_hook.length > 0) ||
        splSafe.is_transfer_hook_upgradable === 1) {
        splSafe.is_black_listed = 1;
    };

    // 其实：能上dex，就表示可被转账。弃用：is_non_transferable字段    
    // non_transferable: "0" 可自由转账（安全）；"1" 不可转移（风险）
    // splSafe.is_non_transferable = toT3(rawGpSplTokenSecurityInfo.non_transferable);

    // ==== 可信标签（中性） ====
    splSafe.is_trusted_token = toT3(rawGpSplTokenSecurityInfo.trusted_token);

    // ==== pump/bonk 相关与 create_tx 来源于 solscan/自定义检测，故不覆盖 ====
    // safe.create_tx   —— 保留原值
    // safe.is_pump     —— 保留原值
    // safe.is_fake_pump—— 保留原值
    // safe.is_bonk     —— 保留原值
    // safe.is_fake_bonk—— 保留原值

    // is_scam 联动规则
    const is_scam =
        splSafe.is_fake_pump === 1 ||
        splSafe.is_fake_bonk === 1 ||
        splSafe.is_mint_able === 1 ||
        splSafe.is_freez_able === 1;
    splSafe.is_scam = is_scam ? 1 : 0;

    return splSafe;
}

export function set_GpEvm_TokenSecurity_To_Gr_Token(
    rawGpEvmTokenSecurityParsed: IRawGpEvmTokenSecurityResponse,
    token: IGrTokenSortItem_Client,

) {
    const rawGpEvmTokenSecurityInfo: IRawGpEvmTokenSecurityInfo = rawGpEvmTokenSecurityParsed.result[token.ca];
    if (rawGpEvmTokenSecurityInfo === undefined) {
        console.log('gpEvmTokenSecurityInfo===undefined on set_GpEvm_TokenSecurity_To_Gr_Token(),token.ca=', token.ca);
        return;
    }

    // 统一批次时间（避免每个 item 差几毫秒/秒）
    // const nowSec = Math.floor(Date.now() / 1000);

    //============ 先补全：不在evm_safe对象的信息 ============
    assign_If_Target_Empty(token, 'symbol', rawGpEvmTokenSecurityInfo.token_symbol);

    // rawGpEvmTokenSecurityInfo.holder_count有值，并且：rawGpEvmTokenSecurityInfo.gr_cache_t_sec的时间是:最新的,才更新
    if (isNotEmpty(rawGpEvmTokenSecurityInfo.holder_count) && rawGpEvmTokenSecurityInfo.gr_cache_t_sec > token.update_state.holders_total_l_u_sec) {
        token.holders.total = mathCut_ParseInt_s2n(rawGpEvmTokenSecurityInfo.holder_count);
        token.update_state.holders_total_l_u_sec = rawGpEvmTokenSecurityInfo.gr_cache_t_sec;
    }

    // token.holders.top10_percent = String(get_GpEvm_Holders_Top10_Percent(gpEvmTokenSecurityInfo.holders));
    if (Array.isArray(rawGpEvmTokenSecurityInfo.holders) &&
        rawGpEvmTokenSecurityInfo.holders.length > 0) {
        // token.holders.top10_percent = String(get_GpEvm_Holders_Top10_Percent(gpEvmTokenSecurityInfo.holders));
        token.holders.top_10_percent = mathRound_d2_n2n(get_GpEvm_Holders_Top10_Percent(rawGpEvmTokenSecurityInfo.holders) * 100);
    }

    token.dev.creator_aa = rawGpEvmTokenSecurityInfo.creator_address;
    token.dev.creator_balance = rawGpEvmTokenSecurityInfo.creator_balance;
    token.dev.creator_percent = rawGpEvmTokenSecurityInfo.creator_percent;

    //============ 然后再补全：在evm_safe对象的信息 ============
    normalize_Evm_Security_Info(rawGpEvmTokenSecurityInfo, token.evm_safe!);
}
/**
 * 将原始的 GoPlus EVM Token 安全检测信息（宽松类型）
 * 归一化为业务内部的 IEvmSafe（稳定 -1 | 0 | 1 值）
 */
export function normalize_Evm_Security_Info(
    rawGpEvmTokenSecurityInfo: IRawGpEvmTokenSecurityInfo,
    evmSafe: IEvmSafe
): IEvmSafe {
    // ==== 高风险大类 ====
    evmSafe.is_honeypot = toT3(rawGpEvmTokenSecurityInfo.is_honeypot);
    evmSafe.is_honeypot_with_same_creator = toT3(rawGpEvmTokenSecurityInfo.honeypot_with_same_creator);

    // trust_list：是可选字段。确保 toT3 遇到 undefined 返回 -1；
    evmSafe.is_trust_list = rawGpEvmTokenSecurityInfo.trust_list != null
        ? toT3(rawGpEvmTokenSecurityInfo.trust_list)
        : -1;

    evmSafe.is_anti_whale = toT3(rawGpEvmTokenSecurityInfo.is_anti_whale);
    evmSafe.is_anti_whale_modifiable = toT3(rawGpEvmTokenSecurityInfo.anti_whale_modifiable);
    evmSafe.is_can_take_back_ownership = toT3(rawGpEvmTokenSecurityInfo.can_take_back_ownership);
    evmSafe.is_cannot_buy = toT3(rawGpEvmTokenSecurityInfo.cannot_buy);
    evmSafe.is_cannot_sell_all = toT3(rawGpEvmTokenSecurityInfo.cannot_sell_all);
    evmSafe.is_external_call = toT3(rawGpEvmTokenSecurityInfo.external_call);
    evmSafe.is_hidden_owner = toT3(rawGpEvmTokenSecurityInfo.hidden_owner);

    evmSafe.is_in_dex = toT3(rawGpEvmTokenSecurityInfo.is_in_dex);
    evmSafe.is_mint_able = toT3(rawGpEvmTokenSecurityInfo.is_mintable);
    evmSafe.is_open_source = toT3(rawGpEvmTokenSecurityInfo.is_open_source);
    evmSafe.is_proxy = toT3(rawGpEvmTokenSecurityInfo.is_proxy);

    evmSafe.is_white_listed = toT3(rawGpEvmTokenSecurityInfo.is_whitelisted);
    evmSafe.is_black_listed = toT3(rawGpEvmTokenSecurityInfo.is_blacklisted);

    evmSafe.is_selfdestruct = toT3(rawGpEvmTokenSecurityInfo.selfdestruct);
    evmSafe.is_trading_cooldown = toT3(rawGpEvmTokenSecurityInfo.trading_cooldown);
    evmSafe.is_transfer_pausable = toT3(rawGpEvmTokenSecurityInfo.transfer_pausable);
    // evmSafe.is_transfer_tax = toT3From_Presence(rawGpEvmTokenSecurityInfo.transfer_tax);
    // 注意：还没遇到transfer_tax值主:非0 的值测试
    // 额外：布尔态（是否存在转账税）
    if (isNotEmpty(rawGpEvmTokenSecurityInfo.transfer_tax)) {
        const v = Number.parseFloat(rawGpEvmTokenSecurityInfo.transfer_tax);
        evmSafe.is_transfer_tax = Number.isFinite(v) ? (v > 0 ? 1 : 0) : -1;
    } else {
        evmSafe.is_transfer_tax = -1;
    }

    evmSafe.is_slippage_modifiable = toT3(rawGpEvmTokenSecurityInfo.slippage_modifiable);
    evmSafe.is_personal_slippage_modifiable = toT3(rawGpEvmTokenSecurityInfo.personal_slippage_modifiable);

    // ==== 所有者信息 ====
    evmSafe.owner_address = rawGpEvmTokenSecurityInfo.owner_address;
    evmSafe.owner_balance = parseNumberOrZero(rawGpEvmTokenSecurityInfo.owner_balance);
    evmSafe.owner_change_balance = parseNumberOrZero(rawGpEvmTokenSecurityInfo.owner_change_balance);
    evmSafe.owner_percent = parseNumberOrZero(rawGpEvmTokenSecurityInfo.owner_percent);

    // 是否放弃所有权：owner_address 为空 或 常见的 renounce 地址
    let is_ownership_renounced: T3State = -1;
    // 仅 null/undefined 视为“未知”；空字符串也要进入 v2（并会判定为 1）
    if (rawGpEvmTokenSecurityInfo.owner_address != null) {
        is_ownership_renounced = is_GpEvm_OwnershipRenounced_v2(rawGpEvmTokenSecurityInfo.owner_address);
    }
    evmSafe.is_ownership_renounced = is_ownership_renounced;


    // ==== LP 锁定状态（推导字段） ====    
    // 锁池子判断(可传入：锁池子比例阈值，大于多少。默认：0.4[即：40% ])
    let is_lp_locked: T3State = is_GpEvm_LpLocked_fast(rawGpEvmTokenSecurityInfo);
    evmSafe.is_lp_locked = is_lp_locked;

    // ==== 手续费类 ====
    //买入手续费
    evmSafe.buy_tax = mathRound_Percent_d2_s2n(rawGpEvmTokenSecurityInfo.buy_tax);

    //卖出手续费
    evmSafe.sell_tax = mathRound_Percent_d2_s2n(rawGpEvmTokenSecurityInfo.sell_tax);

    //转账手续费
    evmSafe.trans_tax = mathRound_Percent_d2_s2n(rawGpEvmTokenSecurityInfo.transfer_tax);

    // ==== is_scam 联动规则（示例） ====
    const is_scam =
        evmSafe.is_honeypot === 1 ||
        evmSafe.is_honeypot_with_same_creator === 1 ||
        evmSafe.is_mint_able === 1;
    evmSafe.is_scam = is_scam ? 1 : 0;

    return evmSafe;
}

//------------【第二部分(之三): 合并 TokenSecurity 到原始数据　-----------        
export function combine_Gp_TokenSecurity_To_Gr_Token(
    chainType: string,
    tokens: IGrTokenSortItem_Client[],
    tokenSecurityMap: Map<string, any>,
) {
    tokens.forEach(originalToken => {
        const ca = originalToken.ca;

        const tokenSecurityObject = tokenSecurityMap.get(ca);
        if (tokenSecurityObject) {
            console.log("ca=", ca);
            // console.log(typeof tokenSecurityObject); 输出为：object时，不需要用：JSON.parse(object);
            // console.log(typeof tokenSecurityObject); 输出为：string时，才需要用：JSON.parse(string);
            console.log(typeof tokenSecurityObject); // string or object?
            if (chainType === "sol") {
                // const gpSplTokenSecurityParsed: IGpSplTokenSecurityResponse = JSON.parse(tokenSecurityJson);
                const rawGpSplTokenSecurityParsed: IRawGpSplTokenSecurityResponse = tokenSecurityObject;
                set_GpSpl_TokenSecurity_To_Gr_Token(rawGpSplTokenSecurityParsed, originalToken);

            } else {
                // const gpEvmTokenSecurityParsed: IGpEvmTokenSecurityResponse = JSON.parse(tokenSecurityObject);
                const rawGpEvmTokenSecurityParsed: IRawGpEvmTokenSecurityResponse = tokenSecurityObject;
                // 下行函数，未实现
                set_GpEvm_TokenSecurity_To_Gr_Token(rawGpEvmTokenSecurityParsed, originalToken);
            }
        }
    });
}

//------------【第四部分(之三): 合并 TokenMeta 到原始数据　-----------        
export function combine_MoEvm_Or_SolSpl_TokenMeta_To_Gr_Token(
    chainType: string,
    tokens: IGrTokenSortItem_Client[],
    tokenMetaMap: Map<string, any>,
) {
    tokens.forEach(originalToken => {
        const ca = originalToken.ca;

        const tokenMetaObject = tokenMetaMap.get(ca);
        if (tokenMetaObject) {
            console.log("ca=", ca);
            // console.log(typeof tokenSecurityObject); 输出为：object时，不需要用：JSON.parse(object);
            // console.log(typeof tokenSecurityObject); 输出为：string时，才需要用：JSON.parse(string);
            // console.log(typeof tokenMetaObject); // string or object?
            if (chainType === "sol") {
                // const solSplTokenMetaParsed: ISolSplTokenMetaResponse = tokenMetaObject;
                const solSplTokenMetaParsed: ISolSplTokenItem = tokenMetaObject;
                set_SolSpl_TokenMeta_To_Gr_Token(solSplTokenMetaParsed, originalToken);
            } else {
                const moEvmTokenMetaParsed: IMoEvmTokenMeta = tokenMetaObject;
                set_MoEvm_TokenMeta_To_Gr_Token(moEvmTokenMetaParsed, originalToken);
            }
        }
    });
}

function set_GpEvm_TokenSecurity_To_Gr_Token_old_del(
    rawGpEvmTokenSecurityParsed: IRawGpEvmTokenSecurityResponse,
    token: IGrTokenSortItem_Client,

) {
    const rawGpEvmTokenSecurityInfo: IRawGpEvmTokenSecurityInfo = rawGpEvmTokenSecurityParsed.result[token.ca];
    if (rawGpEvmTokenSecurityInfo === undefined) {
        console.log('gpEvmTokenSecurityInfo===undefined on set_GpEvm_TokenSecurity_To_Gr_Token(),token.ca=', token.ca);
        return;
    }
    // token.symbol = gpEvmTokenSecurityInfo.token_symbol;
    assign_If_Target_Empty(token, 'symbol', rawGpEvmTokenSecurityInfo.token_symbol);
    token.holders.total = mathCut_ParseInt_s2n(rawGpEvmTokenSecurityInfo.holder_count);
    // token.holders.top10_percent = String(get_GpEvm_Holders_Top10_Percent(gpEvmTokenSecurityInfo.holders));
    if (rawGpEvmTokenSecurityInfo.holders && rawGpEvmTokenSecurityInfo.holders.length > 0) {
        // token.holders.top10_percent = String(get_GpEvm_Holders_Top10_Percent(gpEvmTokenSecurityInfo.holders));
        token.holders.top_10_percent = mathRound_d2_n2n(get_GpEvm_Holders_Top10_Percent(rawGpEvmTokenSecurityInfo.holders) * 100);
    }

    token.dev.creator_aa = rawGpEvmTokenSecurityInfo.creator_address;
    token.dev.creator_balance = rawGpEvmTokenSecurityInfo.creator_balance;
    token.dev.creator_percent = rawGpEvmTokenSecurityInfo.creator_percent;

    let is_scam: T3State = is_GpEvm_ScamToken_v1(rawGpEvmTokenSecurityInfo);//骗局（貔貅）

    let is_ownership_renounced: T3State = -1;
    if (rawGpEvmTokenSecurityInfo.owner_address) {
        is_ownership_renounced = is_GpEvm_OwnershipRenounced_v2(rawGpEvmTokenSecurityInfo.owner_address);
    }

    let is_mintable: T3State = parseInt(rawGpEvmTokenSecurityInfo.is_mintable) as T3State;     //增发
    let is_open_source: T3State = parseInt(rawGpEvmTokenSecurityInfo.is_open_source) as T3State;  //开源
    // let is_white_listed = -1; //白名单
    // let is_black_listed = -1; //黑名单
    let is_anti_whale: T3State = parseInt(rawGpEvmTokenSecurityInfo.is_anti_whale) as T3State;   //防巨鲸

    // let is_lp_locked: T3State = is_GpEvm_LpLocked_old(gpEvmTokenSecurityInfo);    //锁池子
    //锁池子(可传入：锁池子比例我，大于多少。默认：0.4[即：40% ])
    let is_lp_locked: T3State = is_GpEvm_LpLocked_fast(rawGpEvmTokenSecurityInfo);

    //goplus 安全检测
    token.evm_safe!.is_scam = is_scam;

    token.evm_safe!.is_ownership_renounced = is_ownership_renounced;
    token.evm_safe!.is_mint_able = is_mintable;
    token.evm_safe!.is_open_source = is_open_source;
    // token.evm_safe!.is_white_listed = is_white_listed;
    // token.evm_safe!.is_black_listed = is_black_listed;
    token.evm_safe!.is_anti_whale = is_anti_whale;
    token.evm_safe!.is_lp_locked = is_lp_locked;

    //买入手续费
    if (isNotEmpty(rawGpEvmTokenSecurityInfo.buy_tax)) {
        token.evm_safe!.buy_tax = mathRound_Percent_d2_s2n(rawGpEvmTokenSecurityInfo.buy_tax);
    }

    //卖出手续费
    if (isNotEmpty(rawGpEvmTokenSecurityInfo.sell_tax)) {
        token.evm_safe!.sell_tax = mathRound_Percent_d2_s2n(rawGpEvmTokenSecurityInfo.sell_tax);
    }

    //转账手续费
    if (isNotEmpty(rawGpEvmTokenSecurityInfo.transfer_tax)) {
        token.evm_safe!.trans_tax = mathRound_Percent_d2_s2n(rawGpEvmTokenSecurityInfo.transfer_tax);
    }
}
