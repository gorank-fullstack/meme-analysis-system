// export type TTimeframeKey = "m5" | "m15" | "m30" | "h1" | "h6" | "h24";
// export type TTimeframeKey = "m5" | "h1" | "h6" | "h24";
import { TTimeframe_PriceChange, TQtType, T3State } from "@gr/interface-base"
import { TPlatformType } from "@gr/interface-base";

//------------------------------- Tokens --------------------------------------------------------------
//支持排序的字段
//IHot接口，支持排序的字段(字段：必须是number类型)
export type TSortField_Client =
    | 'c_t_iso'
    | 'c_t_s'
    | 'price'
    | 'holders.total'
    | 'fdv'
    | 'cmc'
    | 'single_liq'
    | 'tranx_1h.all_trader'
    | 'tranx_1h.ind_trader'
    // | 'hot.hc'
    // | 'hot.current_hc'
    | 'vol.5m'
    | 'vol.1h'
    | 'vol.6h'
    | 'vol.24h'

    | 'lv_0_hot_vol.5m'
    | 'lv_0_hot_vol.1h'
    | 'lv_0_hot_vol.6h'
    | 'lv_0_hot_vol.24h'

    | 'lv_1_hot_vol.5m'
    | 'lv_1_hot_vol.1h'
    | 'lv_1_hot_vol.6h'
    | 'lv_1_hot_vol.24h'

    | 'lv_2_hot_vol.5m'
    | 'lv_2_hot_vol.1h'
    | 'lv_2_hot_vol.6h'
    | 'lv_2_hot_vol.24h';

export type TSortField_Server = TSortField_Client | 'hot.hc' | 'hot.current_hc' | 'hot.h_time';
// export type IVolume = Record<TQtType, number>;

export interface IDuplicateName {
    total: number,       //重名token的数量
    cmc_index: number,   //此token，在重名token中的cmc（流通市值）排名
    c_t_sec_index: number,//此token，在重名token中的c_t_sec（创建时间）排名
}

export interface IHot {
    hc: number,//总命中次数(hit count的缩写)
    // current_hc: number, //当前时间段命中次数(current hit count的缩写)．比如：5m/1h/6h/24h时间段的命中次数

    l_z_hc: number,      //最近一次清零后:命中的次数    
    l_z_time: number,    //最近一次:清零时间

    i_time: number,//首次插入时间(insert time的缩写)
    h_time: number,//最新命中时间(hit time的缩写)
}

// 返回给客户端的数据，不包含 IHot 对象
export interface IGrTokenSortItem_Client {
    ca: string,
    // pa?: string,
    pa: string, //pool address

    name: string,   //币名(base_name的缩写)
    quote_name: string,   // 计价币名（quote asset name）

    symbol: string, //币名(简写)

    chain: string,   //链名(chain_name的缩写)
    desc: string,    //token描述
    // type: string,   //链类型(即由：chain_name代替，减少岐义)

    // (支持－字段：“c_ca”、“image_url”) 
    // token meta multi

    // c_ca?: string, 转到　dev.aa　定义
    // c_time: string, //池子创建时间．(pool_created_at)

    // (pool_created_at)--池子创建时间.格式:"2024-12-26T05:34:02Z"． ISO 8601 格式 的 UTC 时间表示
    c_t_iso: string,
    c_t_sec: number,  //c_t_iso转Unix 时间戳,以秒为单位

    image_url: string,
    /* 
    Ds在 TypeScript（以及 JavaScript）中，number 类型是 双精度 64 位浮点数（IEEE 754），它的有效数字（整数 + 小数部分）最多只能精确表示 15-17 位。
    const num = 123456789.0123456789; // 共19位（9位整数 + 10位小数）
    console.log(num); // 输出 123456789.01234567（后几位被舍入）
     */
    //[价格不能用:string,因为有小数点后10位，number容易出现精度问题．原：price_usd]
    price: string,
    supply: string, //总供应量，最大保留小数点后6位


    holders: IHolders,

    fdv: number,         //总市值
    // cmc: number | null;  //流通市值[Circulating Market Cap，简称：CMC．原：market_cap_usd字段]
    cmc: number;  //流通市值[Circulating Market Cap，简称：CMC．原：market_cap_usd字段]
    // total_reserve_in_usd: string,   //指的是双边流动性－－有时也用：liquidity_usd　表示
    liq: ILiq,
    dev: IDev,

    // links: IMetaInfo,
    meta: IMeta,
    update_state: IUpdateState,
    other_state: IOtherState,

    // 交易特征--trading_features，在计算完：活跃交易额阶段，再填数据。
    // 因为cg api返回的cmc可能为null，需要其他api返回的数据补全cmc
    trading_features: ITradingFeatures, 
    // safe: ISafe,
    common_safe: ICommonSafe,
    evm_safe: IEvmSafe | null,
    spl_safe: ISplSafe | null,

    // dev_op: string, //add加仓，sub减仓，clear清仓
    price_change: Record<TTimeframe_PriceChange, number>,    //分时价格变化
    // 5m / 1h / 6h / 24h —— 分时交易笔数
    tranx: Record<TQtType, ITransactions>,
    // 5m / 1h / 6h / 24h —— 分时交易额
    vol: Record<TQtType, number>,    //5m/1h/6h/24h--交易额

    // 对不同等级的用户，使用不同的：系数（factor）
    lv_0_factor: number,
    lv_1_factor: number,
    lv_2_factor: number,

    // 应用不同等级 factor 后得到的活跃交易额（5m / 1h / 6h / 24h）    
    // h_vol: Record<TQtType, number>,  //5m/1h/6h/24h--活跃交易额
    lv_0_hot_vol: Record<TQtType, number>,  //5m/1h/6h/24h--活跃交易额
    lv_1_hot_vol: Record<TQtType, number>,  //5m/1h/6h/24h--活跃交易额
    lv_2_hot_vol: Record<TQtType, number>,  //5m/1h/6h/24h--活跃交易额

    // 不同等级系数的详细计算公式（仅开发模式用于验证，生产环境不返回）
    // h_vol_formula: Record<TQtType, string>,//5m/1h/6h/24h--【仅开发过程，对活跃交易额的计算公式进行验证】    
    // 5m/1h/6h/24h -- 计算公式文本
    lv_0_formula: Record<TQtType, string>,
    lv_1_formula: Record<TQtType, string>,
    lv_2_formula: Record<TQtType, string>
    // transactions: Record<TTimeframeKey, ITransactions>;

    // 动态市值列表（最多 144 个点，超出移除最旧；单位：百万 m，小数点后 2 位；    
    // 采样频率（按上线时长 t）

    // k-max表示，K线在144个采集点，最大能记录的时间
    //   t > 12h     → 每 10 分钟-(k-max：24小时 覆盖)
    //   6h  < t ≤ 12h     → 每 5 分钟-(k-max：12小时 覆盖)
    //   2h  < t ≤ 6h     → 每 3 分钟-(k-max：7.2小时 覆盖)
    //   1h  < t ≤ 2h     → 每 1 分钟-(k-max：2.4小时 覆盖)
    //   30m  < t ≤ 1h     → 每 30 秒-(k-max：1.2小时 覆盖)
    //   t ≤ 30m            → 每 15 秒-(k-max：0.6小时[即36分钟] 覆盖)
    // cmc_m_list: string;
    cmc_m_arr: number[];

    // 最后更新：cmc_m_list 的时间戳（秒），用于按间隔判断是否需要追加新点
    cmc_m_l_u_sec: number,
}

export interface ITransactions {
    buys: number;   //购买地址数
    sells: number;
    all_trader: number;  //buys+sells;

    buyers: number; //购买独立地址数
    sellers: number;
    ind_trader: number;  //buys+sells;
}

export interface IMeta {
    x: string;      //twitter
    site: string;   //website
    tg: string;     //telegram

    // 若token上线时间大于72小时，此 x/site 还没发此token的合约，则认证不通过    
    // token指向的 x/site，发了这个toek的合约--则认证通过。    
    is_verified_x: T3State;
    is_verified_site: T3State;
}

// 保存最新的状态--主要用于：关键数据的：对比更新
export interface IUpdateState {
    // price: string,
    // holders_total:number,
    // cmc:number,

    price_l_u_sec: number,
    holders_total_l_u_sec: number,
    cmc_l_u_sec: number,
}

// 保存其他的状态
export interface IOtherState {
    is_hot_1h: T3State,   //　是否hot_1h
    is_cto: T3State,      //　是否cto(社區接管)
    is_dex_pay: T3State,   //　是否dexScreen 付费
    is_has_links: T3State,   //　至少有一个主流媒体　(telegram/twitter/website至少有一个)    
}

export interface IDev {
    creator_aa: string,      //创建人地址
    creator_balance: string, //创建人余额
    creator_percent: string, //创建人占比

    is_add_pos: T3State;     //开发者：加仓
    is_reduce_pos: T3State;  //开发者：减仓
    is_clear_pos: T3State;   //开发者：清仓        
}

export interface ILiq {
    single_liq: number, //指的是单边流动性[原：reserve_in_usd]

    is_add_liq: T3State;     //增加：流动性
    is_reduce_liq: T3State;  //减少：流动性
    // is_clear: T3State;   //全部移除/或大部分减少：流动性
    is_remove_liq: T3State;   //全部移除/或大部分减少：流动性
}

// 交易特征
export interface ITradingFeatures {

    raw_real_trading_ratio: Record<TQtType, number>;  //原始的：真实交易比例
    raw_vol_cmc_ratio: Record<TQtType, number>;//原始的：换手率
    raw_vol_avg_ratio: Record<TQtType, number>;//原始的：平均每笔交易额

    //交易量，换手率相关
    is_wash_trading: T3State;           //刷交易量--1: 是（黄色警告，中高风险。） 0: 否
    is_high_turnover_qt: Record<TQtType, T3State>;  // 5m/1h/6h/24h 换手率过高--1: 是（黄色警告，中风险。） 0: 否
    is_high_turnover_initial: T3State;              // 初始换手率过大--1: 是（黄色警告，中风险。） 0: 否

    // 币价，及交易行为
    is_market_manipulated: T3State;     //庄家控盘(通过最近24小时，K线形态判断)--币价被操控--1: 是（黄色警告，中高风险。） 0: 否
}
export interface ICommonSafe {
    //比例
    // 集群集中度 -- 
    cluster_concentration_ratio: number;// 集群集中度--衡量少数地址集群是否持有大部分代币 (cluster,代表：集群)(值越高越集中)

    new_address_ratio: number;   // 新地址比例--排名前 1,000 位的持仓地址为过去 7天(竞品是：3 天内) 所创建的百分比
    same_source_of_funds_ratio: number;// 相同资金来源比例--排名前 1,000 位持有者资金来自同一地址的百分比
    same_create_time_ratio: number;// 相同创建时间比例--排名前 1,000 位持有者地址在同一时间内创建的百分比

    //集中持仓、
    // is_concentrated_holding: T3State; //集中持仓--用：cluster_concentration_ratio的值：来判断：高/中/低
    // is_same_source_of_funds: T3State;//相同资金来源
    // is_same_create_time: T3State; //相同创建时间

    //Token名，相关
    is_has_misleading_icon: T3State;    //Token名里包含：误导性的图标
    is_has_misleading_name: T3State;   //Token名里包含：误导性的名字

    duplicate_name_72h_create: IDuplicateName;  //72小时内，创建的：重名token
    duplicate_name_24h_hot: IDuplicateName;  //24小时内，全部有热度的：重名token
}

export interface IEvmSafe {
    //-1未知，1是，0否
    is_scam: T3State;     //骗局（貔貅）

    // 信任评分/信号    
    is_honeypot: T3State;   //是否为蜜罐（买得进卖不出）.0(安全) → 非蜜罐;1，极高风险
    is_honeypot_with_same_creator: T3State;     //是否该创建者创建过蜜罐代币（1 = 是）

    is_trust_list: T3State;     //是否在 GoPlus 信任列表中:0(中性,不降权);1(信任列表)--但新币很难被列入）

    // 安全属性字段（合约行为判断）
    is_anti_whale: T3State;     //是否启用:防巨鲸机制	防止大额转账，可能限制用户流动性
    is_anti_whale_modifiable: T3State;     //是否支持修改反鲸鱼限制（0=否, 1=是）
    is_can_take_back_ownership: T3State;     //团队是否能重新获得合约所有权	若为1，可能会重新控制合约
    is_cannot_buy: T3State;     //禁止购买,若为1，疑似 honeypot
    is_cannot_sell_all: T3State;     //禁止全部卖出,若为1，疑似 honeypot
    is_external_call: T3State;     //是否存在外部合约调用	若为1，可能存在被调合约逻辑风险
    is_hidden_owner: T3State;   //是否存在隐藏的owner（例如通过代理合约）.若为1，团队可暗中控制合约

    is_in_dex: T3State;     //是否在DEX有交易池	若为0，则用户可能无法正常交易.1(安全)--pvw) → DEX 有交易池
    is_mint_able: T3State;   //是否可增发:0(安全) → 不可增发
    is_open_source: T3State;//是否开源.1(安全)--合约开源
    is_proxy: T3State;      //是否为代理合约	若为1，需继续解析其逻辑合约

    is_white_listed: T3State;   //是否启用白名单限制	若为1，可能控制谁能买卖
    is_black_listed: T3State;   //是否启用黑名单机制.若为1，可能封禁部分地址

    is_selfdestruct: T3State;   //是否支持销毁合约	若为1，合约可被终止
    is_trading_cooldown: T3State;   //是否设置交易冷却期	若为1，用户可能被限制频繁交易
    is_transfer_pausable: T3State;  //是否支持暂停转账	若为1，团队可冻结转账功能
    is_transfer_tax: T3State;       //转账税率	若大于0，为额外成本

    is_slippage_modifiable: T3State;  //是否支持修改滑点限制	若为1，交易过程中滑点可能被操控
    is_personal_slippage_modifiable: T3State;  //是否支持修改滑点限制	若为1，交易过程中滑点可能被操控

    // 所有者与合约控制
    /* 
    owner_address的详细解读--是合约代码中定义的控制者地址（如 Ownable 的 owner），需要通过读取合约状态变量获得；
    owner_address 可能为 ""（空），表示合约已放弃控制权（renounceOwnership）。
    owner_address 是合约中可编程控制权限的“变量”。
     */
    owner_address: string;//当前合约 owner 地址（如为空则为 renounce）
    owner_balance: number;//所有者余额
    owner_change_balance: number;//所有者变更后的余额
    owner_percent: number;//所有者占总量比例（0 则说明合约已放弃所有权）

    /* 
    creator_address的详细解读--是部署合约的地址（创建者），由链上交易创建时记录；
    creator_address 的特点是:不可更改。固定写进区块链历史里的;当合约通过某个地址部署（即执行 CREATE 或 CREATE2）时，链上自动记录
    creator_address 多用于溯源。可判断某人是否发过多个代币
     */
    // 以下：creator定义移入:IDev
    // creator_address: string;//	创建者地址
    // creator_balance: number;//	创建者余额
    // creator_percent: number;//  创建者持币占比


    /* 
    is_ownership_renounced虽不是goPlus的字段,但需要保留.
    弃权[gp返回的字段：owner_address 
    值为:0x0000000000000000000000000000000000000000 
    或 0x000000000000000000000000000000000000dead ]
    是否放弃所有权（派生字段，根据 owner_address 推导）
     */
    is_ownership_renounced: T3State;    //是否放弃所有权（派生字段，根据 owner_address 推导）
    // is_mintable: T3State;     //增发
    // is_open_source: T3State;  //开源
    // is_white_listed: T3State;   //白名单
    // is_black_listed: T3State;  //黑名单
    // is_anti_whale: T3State;   //防巨鲸
    /* 
    is_lp_locked虽然不是goPlus的字段,但也需要保留.
    可以通过goPlus的字段:lp_holders[]{"is_locked": 0}推导.前多少个lp锁池子,占比达一条值,即可视为:池子已经锁定
     */
    is_lp_locked: T3State;   //锁池子

    buy_tax: number;    //买入手续费（转被转化为百分值，并且四舍五入保留2位小数）
    sell_tax: number;   //卖出手续费
    trans_tax: number;   //转账手续费
}

export interface ISplSafe {

    /* gopluse api,返回的：Get token's security and risk data.
    "mintable": {
    "authority": [],  //	有权限执行增发的地址（为空表示没人能增发）
    "status": "0"　　　//"0" 表示当前不可增发，"1" 表示可以增发
    }
     */
    /* 
    注意：sol链的：
    creator_address 和 create_tx ，都是通过solScan的：token meta Api获取。
    create_tx为了通过：Program Id 确认这个token是否在:pump/bonk发射过，还是：假冒在：:pump/bonk发射
     */
    // creator_address: string;//	创建者地址--移入IDev定义
    create_tx: string;
    // possible_created_on字段，是从：solScan的：token meta Api返回的：metadata?.createdOn 声明。但未经过验证
    // 只有当：合约尾号，以：pump/bonk 结尾时，或者：possible_created_on的值是：pump/bonk 时，需要调用：链上确认发射平台
    possible_created_on: TPlatformType | null; //pump|bonk|null 可能是由：pump.fun或bonk.fun创建。

    // is_scam的判断条件:
    // 若 (is_fake_pump===1 || is_fake_bonk===1 
    // || is_mint_able===1 || is_freez_able === 1 )为true, 则:is_scam=1
    is_scam: T3State;     //1(较高风险，需严重降权)--骗局（貔貅）

    // is_mint_discard字段,删除--原因:和 is_mint_able字段重复
    // is_mint_discard: T3State;     //Mint丢弃

    is_pump: T3State,     //　是否pump发射
    is_fake_pump: T3State; // 是否伪装为 pump.fun 发射的钓鱼币

    is_bonk: T3State,     //　是否bonk发射
    is_fake_bonk: T3State; // 是否伪装为 bonk 发射的钓鱼币

    // 以下字段解释，详细见：
    // E:\digit数字货币\Open\06_11_接口_安全_gopluslabs\Sol链：goPluse json_gpt解读gpt.md

    // 👤 创建者风险
    // creators_address: string,               //在 Goplus 中，这个字段用于追踪 Token 项目的原始创建者是谁（并非部署 token 合约，而是设定 metadata 的账户）。
    // creators_malicious_address :1 = 恶意地址，0 = 正常地址，-1 = 未知（例如 creators 列表为空）
    is_creators_malicious_address: T3State;    //原始字段,仅sol有malicious_address--这是 Goplus 风控系统标记该地址是否是恶意创建者的标识字段。

    // 🔒 合约控制权限类风险（是否可被操控）
    is_balance_mutable_authority: T3State;  //0(安全)--没有权限修改余额
    is_clos_able: T3State;   //0(安全)--不能关闭账户
    is_default_account_state: T3State;              //0(安全)--账户默认可用;1(中风险)--账户冻结状态,需要额外操作才能启用
    is_default_account_state_upgradable: T3State;   //0(安全)--默认账户状态不可升级;1(风险)--表示合约可升级默认状态
    is_freez_able: T3State;   //0(安全)--无冻结权限

    is_metadata_mutable: T3State;     //0(安全) = 不可修改元(metadata)信息;1 = 可修改（中风险）
    is_mint_able: T3State;     //0(安全)--无增发权限

    // 💸 手续费 + Hook 等隐藏成本控制
    is_transfer_fee: T3State;      //0(安全)--api原始字段：{}	没有转账手续费
    is_transfer_fee_upgradable: T3State;//0(安全)--无手续费升级权限

    // transfer_hook/transfer_hook_upgradable 实现黑名单、白名单、税收机制等“交易拦截/限制”功能的常见方式。
    is_transfer_hook: T3State;      //0(安全)--api原始字段：[]	无额外转账 hook
    is_transfer_hook_upgradable: T3State;//0(安全)--无 额外转账hook 升级权限

    // 🛑 黑名单记录--通过goPlus返回的数据，并无法判断是否存在：黑名单
    is_black_listed: T3State;  //黑名单    

    // 其实：能上dex，就表示可被转账。弃用：is_non_transferable字段    
    // is_non_transferable: T3State;//0(安全)--Token 可自由转账

    // 🟡 中性标签（非风险项）
    is_trusted_token: T3State;   //0(中性)--未被 GoPlus 明确标记为可信，但也不是负面（⚪ 中性）


}

// (支持－接口：IHolders）
// Mo-Evm:Get ERC20 Token Holder Stats【PATH PARAMS：address string】
// Mo-Sol:Get Token Holder Stats【PATH PARAMS：address string】
export interface IHolders {
    total: number,      //总持币地址数
    top_10_percent: number,  //Top 10 持仓占比 (存的是：%单位，不用再*100)
    top_100_percent: number,  //Top 100 持仓占比 (存的是：%单位，不用再*100)
    // change_1h: IHolderChangeItem,
    change_1h: number,  //1小时持币地址数变化
    swap_percent: number; //通过交易的 token持有者 的来源占比(存的是：%单位，不用再*100)
    // source: IHoldersByAcquisition,  //持币来源

    // 大户、虾米、聪明钱包、KOL持仓
    whale_holders: number; // 大户持仓地址数
    small_holders: number; // 小额分散持仓地址数（依据链原生资产余额，不是此 Token）
    smart_holders: number; // 聪明钱持仓地址数
    kol_holders: number;   // KOL持仓地址数
}

export interface IGrTokenSortItem_ClientResponse {
    results: number, //查找到的记录数，用于设定翻页
    grTokenSortItems: IGrTokenSortItem_Client[],
}

export interface IGrTokenSortItem_Server extends IGrTokenSortItem_Client {
    hot: IHot,
}

export interface IGrTokenSortPageResult_Client {
    maxPage: number;
    list: IGrTokenSortItem_Client[];
}

export interface IGrTokenSortPageResult_Server {
    maxPage: number;
    list: IGrTokenSortItem_Server[];
}