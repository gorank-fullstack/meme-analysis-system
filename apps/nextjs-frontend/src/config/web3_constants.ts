// 所有表格名
export const LOWDB_TABLE_NAME = {
    TOKEN: "token",
    KLINE: "kline",
    ADDRESS: "address",
    TRX: "trx"
}

//LOWDB_TABLE_NAME，所有表格，支持搜索的字段名
export const LOWDB_TABLE_QUERY_FIELD = {
    CA: "ca",
    AA: "aa"
}

//Token页，可认切换的选项
export const TRADE_TAB = {
    TRX: "trx",
    ADDRESS: "address",
}

//Token页，默认显示的Tab选项
export const TRADE_TAB_DEFAULT = TRADE_TAB.TRX;


export type LIMIT_TABLE_NAME = "token" | "kline" | "address" | "trx";

//对要查询的：表格名，进行限制
export const TABLE_NAMES: string[] = ["token", "kline", "address", "trx"];
//对要查询的：字段名，进行限制
export const TABLE_QUERY_FIELDS: string[] = ["ca", "aa"];
