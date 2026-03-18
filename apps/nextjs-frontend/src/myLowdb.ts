import { JSONFilePreset } from "lowdb/node";
// import { Low, LowSync } from '../core/Low.js';
import { Low } from 'lowdb';
export interface IToken {
  id: string,
  aa?: string; // 可选属性

  /* 币名称、币符号、合约地址、图片、时间*/
  name: string,
  symbol: string,
  ca: string, /* (ca =　Contract address) */
  imageUrl: string,
  time: string,

  /* 池子、市值、tr指数、持有的人数、聪明钱的数量 */
  pool: string,
  marketValue: string,
  tokenRank: string,
  holders: string,
  smartMoney: string,

  /* 总量、KOL数量、创建人地址 */
  total: string,
  kols: string,
  tokenCreator: string,

  /* 池子 >>> assetA 本币，assetB 法币。liq 当前流动性，initial 初始流动性，poolCreateTime 池子创建时间 */
  /* 池子一 */
  pool_0: {
    assetA_liq: string,
    assetA_initial: string,

    assetB_name: string,
    assetB_address: string,
    assetB_liq: string,
    assetB_initial: string,

    poolCreateTime: string
  },

  /* 池子二 */
  pool_1: {
    assetA_liq: string,
    assetA_initial: string,

    assetB_name: string,
    assetB_address: string,
    assetB_liq: string,
    assetB_initial: string,

    poolCreateTime: string
  },

  /* 媒体--twitter、电报、网站　*/
  media: {
    twitterUrl: string,  /* 推特url可。结合twitterId判断推特改名历史 */
    twitterId: string,  /* 不可改 */
    telegram: string,
    webSite: string,
  },

  /* 交易--笔数、金额　*/
  trx: {
    quantity: string,
    amount: string,
  }

  price: string,

  /* 安全审核--Mint丢弃、黑名单、LP烧毁 */
  audit: {
    mintDiscard: string,
    blackList: string,
    lpBurnt: string,
  }

  /* 安全审核--内部人士（老鼠仓）、Top10持有占比 */
  degen: {
    insiders: string,
    top10: string,
  }

  /* dev--没有卖出、卖出全部、烧毁代币、烧毁代币 */
  dev: {
    notSold: string,
    sellAll: string,
    burnt: string,
    add: string,
  }
}

export interface IKline {
  id: string,
  aa?: string; // 可选属性
  ca: string, /* (ca =　Contract address) */
  /* 时间、开盘价、最高价、最低价、收盘价 */
  time: string,
  open: number,
  high: number,
  low: number,
  close: number,
}

export interface IAddress {
  id: string,
  ca: string, /* (ca =　Contract address) */

  /* 交易账户地址、余额、创建时间、资金来源、转账时间 */
  aa: string, /* (aa =　Account address) */
  balance: string,
  createTime: string,
  sourceOfFunds: string,
  transferTime: string,

  /* 买入数量、卖出数量、买入金额、卖出金额、总收益(usd） */
  buyQuantity: string,
  sellQuantity: string,
  buyAmount: string,
  sellAmount: string,
  totalProfit: string,

  /* 已经实现收益、待实现收益、买入均价、卖出均价、持有时间 */
  alreadyProfit: string,
  waitProfit: string,
  holdingTime: string,
  avgBuyPrice: string,
  avgSellPrice: string,

  /* 买入次数、卖出次数、最后一笔交易时间 */
  buyTimes: string,
  sellTimes: string,
  lastTrxTime: string,
}


// export type ITokenOrKlineOrTrx = IToken | IKline | ITrx;
export interface ITrx {
  id: string,
  ca: string, /* (ca =　Contract address) */
  aa: string,/* 交易地址 */

  /* 时间、操作、金额、数量、价格 */
  time: string,
  operate: string,  /* 支持：买入、卖出、加池子、减池子*/

  amount: string,   /* 加池子、减池子时，此信息为空 */
  /* 买入、卖出时，quantity信息为：操作的Ａ币数量
  若是加池子、减池子时，quantity此信息为：Ａ币数量 */
  quantity: string, 
  /* 买入、卖出时，price信息为：Ａ币单价
  若是加池子、减池子时，price此信息为：Ｂ币数量 */
  price: string,

  /* assetA_quantity: string,  */ /* 加池子、减池子时,A币数量*/
  /* assetB_quantity: string,  */ /* 加池子、减池子时,B币数量*/
}

/* interface IParams{
    params: {id: string }
} */
/* const sol_token_data: { posts: { id: string, title: string, content: string }[] } = { */
const sol_token_data: { posts: IToken[] } = {
  posts: [],
};

const sol_kline_data: { posts: IKline[] } = {
  posts: [],
};

const sol_address_data: { posts: IAddress[] } = {
  posts: [],
};

const sol_trx_data: { posts: ITrx[] } = {
  posts: [],
};


// type accessTypes = "token" | "kline" | "trx";
/* 注意：这里的:token?:any;准确的类型是：Promise<Low<Data>>，为了不引入lowdb，这里不显式定义类型 */
// const solLowDb: { [key in accessTypes]?: Low<{ posts: IToken[]; }>; [key in accessTypes]?: Low<{ posts: IKline[]; }>; [key in accessTypes]?: Low<{ posts: ITrx[]; }> } = {};
// const sol_token_data: { posts: IToken[] } = {}
//const solLowDb: { [key in accessTypes]?: Low<{ posts: IToken[] | IKline[] | ITrx[] }>; } = {}
// const tokenKey: accessTypes = "token"; // 只能是 "token", "kline", 或 "trx"



/* 向chatGpt提问：有如下定义：
const sol_token_data: { posts: IToken[] } = {posts: []};
const sol_kline_data: { posts: IKline[] } = {posts: []};
const sol_trx_data: { posts: ITrx[] } = {posts: []};
使用const solLowDb: { [typeName: string]: Low<{ posts: any[] }>; } = {};这行代码，
出现了Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any */
// const solLowDb: { [typeName: string]: Low<{ posts: any[] }>; } = {};
/* const solLowDb: {
    [typeName: string]: Low<{ posts: IToken[] } | { posts: IKline[] } | { posts: ITrx[] }>;
  } = {}; */
/* 以下为chatGpt对上行代码，编译提示：  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any的改进*/
/* type Low<T> = {
    data: T;
  }; */
// 假设 Low 类型有 update 方法
/* interface Low<T> {
    posts: T;
    update: () => void;
  } */
/* const solLowDb: {
    [typeName: string]: Low<{ posts: IToken[] } | { posts: IKline[] } | { posts: ITrx[] }>;
  } = {}; */

/*   const solLowDb: {
    [typeName: string]: Low<{ posts: IToken[] }> | Low<{ posts: IKline[] }> | Low<{ posts: ITrx[] }>;
  } = {};   */
// const solLowDb: { [typeName: string]: Low<{ posts: IToken[] | IKline[] | ITrx[] }>; } = {};
/* const solLowDb: {
    [typeName: string]: Low<{ posts: IToken[] } | { posts: IKline[] } | { posts: ITrx[] }>;
  } = {};
type LowPostsType = IToken | IKline | ITrx;

function assignToLowDb<T extends LowPostsType>(
  db: { [key: string]: Low<{ posts: T[] }> },
  key: string,
  value: Low<{ posts: T[] }>
) {
  db[key] = value;
} */

// 解决方案一(chatGpt）：
/* [key: string]: Low<{ posts: IToken[] |IKline[]|ITrx[] }>; // 字符串索引签名 */
type SolLowDb = {

  token: Low<{ posts: IToken[] }>;
  kline: Low<{ posts: IKline[] }>;
  address: Low<{ posts: IAddress[] }>;
  trx: Low<{ posts: ITrx[] }>;
};

/*  const solLowDb: Partial<SolLowDb> = {};这行代码的作用是创建一个对象 solLowDb，
其类型是 SolLowDb 的 部分（Partial）。它允许 solLowDb 对象中的属性是 可选的，而不必完全实现 SolLowDb 的所有属性。 */
/* 
Partial<Type> 的含义
Partial<Type> 是 TypeScript 内置的一个工具类型。它会将给定类型的所有属性变为可选。
 */
const solLowDb: Partial<SolLowDb> = {};
/* 使用 Partial<SolLowDb> 后，solLowDb 的类型变为：
type Partial<SolLowDb> = {
token?: Low<{ posts: IToken[] }>;
kline?: Low<{ posts: IKline[] }>;
trx?: Low<{ posts: ITrx[] }>;
};
 */
// const kline_table_name: keyof SolLowDb = "kline"; // 显式声明为 keyof SolLowDb
solLowDb.token = await JSONFilePreset("data/sol/token/db.json", sol_token_data) as Low<{ posts: IToken[] }>;
// solLowDb[kline_table_name] = await JSONFilePreset("data/sol/token/db.json", sol_token_data)  as Low<{ posts: IKline[] }>;

//使用： const solLowDb: Partial<SolLowDb> = {};之后，就可以使用下面这行代码
// solLowDb["token"] = await JSONFilePreset("data/sol/token/db.json", sol_token_data);

solLowDb.kline = await JSONFilePreset("data/sol/kline/db.json", sol_kline_data) as Low<{ posts: IKline[] }>;
solLowDb.address = await JSONFilePreset("data/sol/address/db.json", sol_address_data) as Low<{ posts: IAddress[] }>;
solLowDb.trx = await JSONFilePreset("data/sol/trx/db.json", sol_trx_data) as Low<{ posts: ITrx[] }>;
export { solLowDb };
// 解决方案二：
/* export async function getSolLowDb(tableName: string){
  if (tableName === "token") {
    return await JSONFilePreset("data/sol/token/db.json", sol_token_data) as Low<{ posts: IToken[] }>;
  } else if (tableName === "kline") {
    return await JSONFilePreset("data/sol/kline/db.json", sol_kline_data) as Low<{ posts: IKline[] }>;
  } else if (tableName === "trx") {
    return await JSONFilePreset("data/sol/trx/db.json", sol_trx_data) as Low<{ posts: ITrx[] }>;
  }
  return null;
} */

// assignToLowDb(solLowDb, "token", await JSONFilePreset("data/sol/token/db.json", sol_token_data));
/* solLowDb["token"] = await JSONFilePreset("data/sol/token/db.json", sol_token_data);
// solLowDb["token"] = await JSONFilePreset("data/sol/token/db.json", sol_token_data) as Low<{ posts: IToken[] }>;

solLowDb["kline"] = await JSONFilePreset("data/sol/kline/db.json", sol_kline_data);
solLowDb["trx"] = await JSONFilePreset("data/sol/trx/db.json", sol_trx_data); */

// export { solToken_LowDb,solKline_LowDb,solTrx_LowDb };

