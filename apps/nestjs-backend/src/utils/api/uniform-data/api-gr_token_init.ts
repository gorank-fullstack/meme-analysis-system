
import {
    ICgPoolItem,
    IMoEvmTokenMeta,
    ISolSplTokenItem,
    ISolSplTokenMetaResponse,
    // ICgPoolListResponse, IcgTokenItem, IcgTokenListResponse 
} from "@gr/interface-api/platform-data";

import { ICommonSafe, IDev, IEvmSafe, IGrTokenSortItem_Client, IMeta, ISplSafe, ITradingFeatures, ITransactions } from "@gr/interface-api/uniform-data";
import { T3State, TQtType } from "@gr/interface-base";
import {
    mathRound_ParseFloat_d2_s2n, mathCut_ParseInt_s2n,
    mathRound_d2_n2n, mathRound_Percent_d2_s2n, parseNumberOrZero,
    //  toCmcMillion 
} from '@gr/interface-utils';

function initDev(): IDev {
    return {
        creator_aa: "",
        creator_balance: "",
        creator_percent: "",

        is_add_pos: -1,
        is_reduce_pos: -1,
        is_clear_pos: -1
    }
}
function initMeta(): IMeta {
    return {
        x: "",
        site: "",
        tg: "",

        is_verified_x: -1,
        is_verified_site: -1
    }
}

// 初始化 值类型为：number，值为：0 的函数
function init_Number_Zero(): Record<TQtType, number> {
    return {
        '5m': 0,
        '1h': 0,
        '6h': 0,
        '24h': 0,
    };
}

// 初始化 值类型为：number，值为：-1 的函数（数值语义：-1）
function init_Number_NegOne(): Record<TQtType, number> {
    return {
        '5m': -1,
        '1h': -1,
        '6h': -1,
        '24h': -1,
    };
}

// 初始化 值类型为：T3State，值为：-1 的函数（T3State 语义：未知）
function init_T3State_NegOne(): Record<TQtType, T3State> {
    return {
        '5m': -1,
        '1h': -1,
        '6h': -1,
        '24h': -1,
    };
}

// 初始化 值类型为：string，值为："" 的函数
function init_String_Empty(): Record<TQtType, string> {
    return {
        '5m': "",
        '1h': "",
        '6h': "",
        '24h': "",
    };
}

function initTradingFeatures(): ITradingFeatures {
    return {

        raw_real_trading_ratio:init_Number_Zero(),
        raw_vol_cmc_ratio:init_Number_Zero(),
        raw_vol_avg_ratio:init_Number_Zero(),

        is_wash_trading: -1,
        is_high_turnover_qt: init_T3State_NegOne(),
        is_high_turnover_initial: -1,

        is_market_manipulated: -1,
    }
}
function initCommonSafe(): ICommonSafe {
    return {
        cluster_concentration_ratio: 0,

        new_address_ratio: 0,
        same_source_of_funds_ratio: 0,
        same_create_time_ratio: 0,



        is_has_misleading_icon: -1,
        is_has_misleading_name: -1,
        duplicate_name_72h_create: {
            total: 0,
            cmc_index: 0,
            c_t_sec_index: 0,
        },
        duplicate_name_24h_hot: {
            total: 0,
            cmc_index: 0,
            c_t_sec_index: 0,
        },
    }
}
function initEvmSafe(): IEvmSafe {
    return {
        is_scam: -1,        //骗局（貔貅）

        is_honeypot: -1,    //蜜罐
        is_honeypot_with_same_creator: -1,   //蜜罐（同创建者）

        is_trust_list: -1,  //是否在 GoPlus 信任列表中:0(中性,不降权);1(信任列表)--但新币很难被列入）

        is_anti_whale: -1,   //防巨鲸
        is_anti_whale_modifiable: -1,    //防巨鲸（可调）
        is_can_take_back_ownership: -1,   //是否可以拿回所有权
        is_cannot_buy: -1,   //是否禁止买入
        is_cannot_sell_all: -1,  //是否禁止全部卖出
        is_external_call: -1,    //外部调用
        is_hidden_owner: -1,     //隐藏所有者

        is_in_dex: -1,       //是否在 DEX 中
        is_mint_able: -1,     //增发
        is_open_source: -1,  //开源
        is_proxy: -1,         //代理

        is_white_listed: -1,   //白名单
        is_black_listed: -1,  //黑名单

        is_selfdestruct: -1,     //自毁
        is_trading_cooldown: -1,  //交易冷却
        is_transfer_pausable: -1,   //转账暂停
        is_transfer_tax: -1,    //转账手续费
        is_slippage_modifiable: -1,   //滑点（可调）
        is_personal_slippage_modifiable: -1,    //个人滑点（可调）

        owner_address: "",   //所有者地址
        owner_balance: 0,    //所有者余额
        owner_change_balance: 0,    //所有者余额变化
        owner_percent: 0,    //所有者占比

        is_ownership_renounced: -1,     //弃权[gp返回的字段：owner_address 值为:0x0000000000000000000000000000000000000000 或 0x000000000000000000000000000000000000dead ]
        is_lp_locked: -1,   //锁池子

        buy_tax: 0,    //买入手续费
        sell_tax: 0,   //卖出手续费
        trans_tax: 0,   //转账手续费
    };
}

function initSplSafe(): ISplSafe {
    return {
        create_tx: "",
        possible_created_on: null,  // possible_created_on字段，是从：solScan的：token meta Api返回的：metadata?.createdOn 声明。但未经过验证

        is_scam: -1,        //骗局（貔貅）

        is_pump: -1,         //pump.fun发射
        is_fake_pump: -1,    //假冒pump.fun发射
        is_bonk: -1,         //bonk.fun发射
        is_fake_bonk: -1,    //假冒bonk.fun发射

        is_creators_malicious_address: -1,   //恶意地址

        is_balance_mutable_authority: -1,  //余额可变权（可转账）
        is_clos_able: -1,  //0(安全)--不能关闭账户
        is_default_account_state: -1,  //0(安全)--账户默认可用;1(中风险)--账户冻结状态,需要额外操作才能启用
        is_default_account_state_upgradable: -1,  //0(安全)--默认账户状态不可升级;1(风险)--表示合约可升级默认状态
        is_freez_able: -1,  //0(安全)--无冻结权限

        is_metadata_mutable: -1,  //元数据可变
        is_mint_able: -1,   //0(安全)--无增发权限


        is_transfer_fee: -1,  //0(安全)--api原始字段：{}	没有转账手续费
        is_transfer_fee_upgradable: -1,  //0(安全)--无手续费升级权限
        is_transfer_hook: -1,  //0(安全)--api原始字段：[]	无额外转账 hook
        is_transfer_hook_upgradable: -1,  //0(安全)--无 额外转账hook 升级权限

        // 其实：能上dex，就表示可被转账。弃用：is_non_transferable字段    
        // is_non_transferable: -1,  //0(安全)--Token 可自由转账

        is_black_listed: -1,  //黑名单

        // 🟡 中性标签（非风险项）
        is_trusted_token: -1,  //0(中性)--未被 GoPlus 明确标记为可信，但也不是负面（⚪ 中性）        
    };
}

//rawCa地址，去掉有：有类似　"eth_"开头的前缀
function parseCaFromRelId(rawCa: string): string {
    if (!rawCa) return '';
    const idx = rawCa.indexOf('_');
    return idx >= 0 ? rawCa.slice(idx + 1) : rawCa;
}

function splitName(name: string): { base: string; quote: string } {
    if (!name) return { base: '', quote: '' };
    const parts = name.split('/');
    if (parts.length >= 2) {
        return { base: parts[0].trim(), quote: parts[1].trim() };
    }
    return { base: name.trim(), quote: '' };
}

function buildTransactions(t?: any): ITransactions {
    const buys = t?.buys || 0;
    const sells = t?.sells || 0;
    const buyers = t?.buyers || 0;
    const sellers = t?.sellers || 0;

    return {
        buys,
        sells,
        // 下行是：有问题的赋值。
        // this 并不指向你想象中的 attr.transactions?.h1，因此：
        // this.buys 和 this.sells 会是 undefined 或报错
        // all_trader: this.buys + this.sells,
        all_trader: buys + sells,
        buyers,
        sellers,
        ind_trader: buyers + sellers,
    };
}

//获取，将 从cg api获取到的：PoolList，转换为：GrTokenList

export function init_Map_Cg_PoolList_To_Gr_TokenList(
    poolList: ICgPoolItem[], chainName: string
): IGrTokenSortItem_Client[] {
    // 统一批次时间（避免每个 item 差几毫秒/秒）
    const nowSec = Math.floor(Date.now() / 1000);

    return poolList.map((item) => {
        const attr = item.attributes;
        const tranx_5m = attr.transactions?.m5;
        const tranx_1h = attr.transactions?.h1;
        const tranx_6h = attr.transactions?.h6;
        const tranx_24h = attr.transactions?.h24;

        const rel = item.relationships;
        const rel_base_ca = rel.base_token.data.id;
        let ca = parseCaFromRelId(rel_base_ca);
        if (chainName !== "sol") {
            // 旧：对evm链的地址格式 转成 EIP-55 checksum 格式（符合行业习惯，减少错输风险）
            // ca = getAddress(ca);

            // 新：对evm链，仅做小写转换
            ca = ca.toLowerCase().trim();
        }
        const pa = attr.address;

        /* let isPump: T3State = -1;
        // let base_name: string = "";
        // let quote_name: string = "";
 
        //若是sol链，判断是否pump
        if (chainType === "sol") {
            isPump = get_CgSpl_Pool_isPump(rel);
        } */
        // 若：attr.name的格式为: "wHYPE / SOL",　
        // 则分隔为：主币名(base_name)，和 对手币名(quote_name)
        const { base: base_name, quote: quote_name } = splitName(attr.name);

        /* if (attr.name.includes("/")) {
            const parts = attr.name.split("/");
            base_name = parts[0].trim();
            quote_name = parts[1].trim();
        } else {
            base_name = attr.name.trim();
            quote_name = "";
        } */

        // 创建 Date 实例（会自动解析为 UTC 时间）
        // 通过：cg的api:attr.pool_created_at返回的时间格式为："2025-07-09T20:06:26Z"
        const c_time_iso = new Date(attr.pool_created_at);
        // 获取 Unix 时间戳（毫秒），转换为秒
        // Date.getTime() 返回的是 毫秒级时间戳
        const c_time_sec = Math.floor(c_time_iso.getTime() / 1000);

        //注意：api.geckoterminal.com返回的：market_cap_usd可能为：null，
        // 若：attr.market_cap_usd为空，则cmc继续为初始化值-1
        //而：fdv是一定不为null
        const fdv = mathRound_ParseFloat_d2_s2n(attr.fdv_usd);

        let cmc = 0;
        let cmc_l_u_sec = 0;

        if (attr.market_cap_usd !== null) {
            cmc = mathRound_ParseFloat_d2_s2n(attr.market_cap_usd);
            cmc_l_u_sec = nowSec;
        } 
        /* else {
            // 若：api.geckoterminal.com返回的：market_cap_usd可能为：null，
            // 则用：fdv代替。因为后面虽然可以用：sol/mo的TokenMeta返回的cmc数据，
            // sol/mo的TokenMetar的缓存时间较长，不是最新的cmc值
            cmc = fdv;
            cmc_l_u_sec = nowSec;
        } */


        // cmc_m是要取：item.cmc的市值，以100万为单位的。保留2位小数，若cmc_m小于0.01则取0.01        
        // const cmc_m = toCmcMillion(cmc);

        const grToken: IGrTokenSortItem_Client = {
            /* 
            .split("_")：将字符串按照 "_" 分隔成一个数组
            [1]：取分割后数组中的第 2 个元素（索引从 0 开始），即 "0x11b75f4b..."
             */
            // ca: rel.base_token.data.id.split("_")[1],   //rel.base_token.data.id,有类似　"eth_"开头
            // ca: rel_base_ca.split("_")[1] ?? rel_base_ca,   //若：rel.base_token.data.id,有"_"字符，则取："_"之后的字符串；没有"_"字符，才复制全字符串．
            ca: ca,
            pa: pa,   //attr.address的值，无"eth_"开头

            name: base_name,
            quote_name: quote_name,
            // symbol: attr.name, // 默认用 name 填充 symbol
            symbol: "",  //Mo平台Get Token Metadata可得(evm批量20个，sol一个）．
            chain: chainName,
            desc: "",

            // c_ca: attr.address,
            // c_ca: "",
            c_t_iso: attr.pool_created_at,
            c_t_sec: c_time_sec,

            image_url: "", // 若需要补全，建议额外请求 token 详情
            price: attr.base_token_price_usd,
            supply: "",

            holders: {
                total: 0,
                top_10_percent: 0,
                top_100_percent: 0,

                change_1h: 0,
                swap_percent: 0,

                whale_holders: 0,
                small_holders: 0,
                smart_holders: 0,
                kol_holders: 0,
            },

            fdv: fdv,
            cmc: cmc,

            meta: initMeta(),
            update_state: {
                // cg返回的数据:
                price_l_u_sec: nowSec,

                // cg返回的数据:没有：持有者，数量
                // 需要在后面：

                // 补充顺序-01: load_Gp_TokenSecurity_From_Redis 函数里
                // ----sol链，调用：set_GpSpl_TokenSecurity_To_Gr_Token时：用：gp的holder_count字段补充
                // ----evl链，调用：set_GpEvm_TokenSecurity_To_Gr_Token时：用：gp的holder_count字段补充

                // 补充顺序-02: load_MoEvm_Or_SolSpl_TokenMeta_From_Redis 函数里
                // ----sol链，调用：set_SolSpl_TokenMeta_To_Gr_Token时：用：solscan的holder字段补充
                // ----evl链，mo的evm链TokenMeta，没有返回：holders.total。这里不需要判断，是否需要补全    

                // 补充顺序-03:实在没有数据，则：用旧数值回填                
                holders_total_l_u_sec: 0,

                // cg返回的数据，cmc可能为null。
                // 需要在后面用：用旧数值，或：
                // sol链的用：solscan的token meta multi->market_cap
                // evm链的用：moralis的Get ERC20 token metadata by contract->momarket_cap返回的数据补充
                cmc_l_u_sec: cmc_l_u_sec,
            },
            other_state: {
                is_hot_1h: -1,
                is_cto: -1,
                is_dex_pay: -1,
                is_has_links: -1,
            },
            trading_features: initTradingFeatures(),
            common_safe: initCommonSafe(),
            evm_safe: chainName === "sol" ? null : initEvmSafe(),
            spl_safe: chainName !== "sol" ? null : initSplSafe(),
            liq: {
                single_liq: mathRound_ParseFloat_d2_s2n(attr.reserve_in_usd),

                is_add_liq: -1,
                is_reduce_liq: -1,
                is_remove_liq: -1,
            },
            dev: initDev(),

            price_change: {
                '1h': mathRound_ParseFloat_d2_s2n(attr.price_change_percentage?.h1),
                '6h': mathRound_ParseFloat_d2_s2n(attr.price_change_percentage?.h6),
                '24h': mathRound_ParseFloat_d2_s2n(attr.price_change_percentage?.h24),
            },

            tranx: {
                '5m': buildTransactions(tranx_5m),
                '1h': buildTransactions(tranx_1h),
                '6h': buildTransactions(tranx_6h),
                '24h': buildTransactions(tranx_24h),
            },
            vol: {
                '5m': mathCut_ParseInt_s2n(attr.volume_usd?.m5),
                '1h': mathCut_ParseInt_s2n(attr.volume_usd?.h1),
                '6h': mathCut_ParseInt_s2n(attr.volume_usd?.h6),
                '24h': mathCut_ParseInt_s2n(attr.volume_usd?.h24),
            },

            lv_0_factor: 1,
            lv_1_factor: 1,
            lv_2_factor: 1,

            lv_0_hot_vol: init_Number_NegOne(),
            lv_1_hot_vol: init_Number_NegOne(),
            lv_2_hot_vol: init_Number_NegOne(),

            lv_0_formula: init_String_Empty(),
            lv_1_formula: init_String_Empty(),
            lv_2_formula: init_String_Empty(),

            // 采样逻辑只放在 hit_And_Update_Record，避免“初始化就立刻再采一次”的绕圈。
            cmc_m_arr: [],
            cmc_m_l_u_sec: -1,
            // volume_usd_1h: attr.volume_usd?.h1 || "0"
        };

        return grToken;
    });
}