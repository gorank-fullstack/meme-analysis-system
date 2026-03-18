"use strict";
// export type TTimeframeKey = "m5" | "m15" | "m30" | "h1" | "h6" | "h24";
// export type TTimeframeKey = "m5" | "h1" | "h6" | "h24";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORT_QT_CACHE_LIST = exports.SUPPORT_QT_FILE_LIST = exports.SUPPORT_QT = exports.SUPPORT_CHAIN = void 0;
exports.isTChainType = isTChainType;
exports.isTTabTypeServer = isTTabTypeServer;
exports.isTTabTypeClient = isTTabTypeClient;
exports.isTQtType = isTQtType;
// 支持的区块链类型列表
exports.SUPPORT_CHAIN = ['sol', 'eth', 'bsc'];
exports.SUPPORT_QT = ['5m', '1h', '6h', '24h']; //所有支持的时间段
exports.SUPPORT_QT_FILE_LIST = ['6h', '24h']; //可以:保存/读取的--文件:时间段
exports.SUPPORT_QT_CACHE_LIST = ['6h', '24h']; //可以:保存/读取的--缓存:时间段
function isTChainType(val) {
    // 性能比：return ["sol", "eth", "bsc"].includes(val);更高
    return val === "sol" || val === "eth" || val === "bsc";
}
function isTTabTypeServer(tab) {
    // 性能比：return ["trending_pools", "new_pools"].includes(tab);更高
    return tab === "trending_pools" || tab === "new_pools";
}
function isTTabTypeClient(tab) {
    return tab === "hot" || tab === "new";
}
function isTQtType(val) {
    // 性能比：return ["5m", "1h", "6h", "24h"].includes(val);更高
    return val === "5m" || val === "1h" || val === "6h" || val === "24h";
}
