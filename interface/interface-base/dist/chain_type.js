"use strict";
// export type TChainType = "sol" | "eth" | "bsc";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_CHAIN_QT_KEYS = exports.SUPPORT_QT_CACHE_LIST = exports.SUPPORT_QT_FILE_LIST = exports.SUPPORT_QT = exports.SUPPORT_CHAIN = void 0;
exports.isTChainName = isTChainName;
exports.isTChainSpl = isTChainSpl;
exports.isTChainEvm = isTChainEvm;
exports.isTChainTvm = isTChainTvm;
exports.isTChainFvm = isTChainFvm;
exports.isTChainTao = isTChainTao;
exports.isTChainMove = isTChainMove;
exports.isTQtType = isTQtType;
exports.isTTabTypeServer = isTTabTypeServer;
exports.isTTabTypeClient = isTTabTypeClient;
// 支持的区块链类型列表
exports.SUPPORT_CHAIN = ['sol', 'eth', 'bsc'];
/**
 * Determine if a given string is a valid TChainName.
 *
 * @param val - The value to check.
 * @returns True if the value is a valid TChainName, false otherwise.
 *
 * Note: This function is more efficient than using includes() because
 * it uses a simple OR expression instead of a potentially expensive
 * includes() search.
 */
function isTChainName(val) {
    // 性能比：return ["sol", "eth", "bsc"].includes(val);更高
    return (
    //spl
    val === "sol" ||
        //evm--以下是mo平台，支持的:链id和token prices
        val === "eth" ||
        val === "bsc" ||
        val === "base" ||
        val === "aval" ||
        val === "arb" ||
        val === "linea" ||
        val === "pulse" ||
        val === "polygon" ||
        val === "optimism" ||
        val === "moonbeam" ||
        val === "gnosis" ||
        val === "ronin" ||
        //evm--以下是mo平台，不支持的:链id/仅支持链id的部分数据，但不支持token prices
        val === "fantom" || //mo平台20250911不支持：fantom--token prices
        val === "cronos" || //mo平台20250911不支持：cronos--token prices
        val === "lisk" || //mo平台20250911不支持：lisk--token prices
        val === "chiliz" || //mo平台20250911不支持：chiliz--token prices
        val === "blast" || //mo平台20250911不支持：blast
        val === "sonic" || //mo平台20250911不支持：sonic
        val === "hyper" || //mo平台20250911不支持：hyper
        val === "sei" || //mo平台20250911不支持：sei
        val === "uni" || //mo平台20250911不支持：uni
        val === "x-layer" || //mo平台20250911不支持：xlayer
        //tvm
        val === "tron" || //mo平台20250911不支持：tron
        //fvm(Flow VM)
        val === "flow" || //mo平台20250911不支持：flow--token prices
        //tao
        val === "bittensor" || //mo平台20250911不支持：bittensor
        //move
        val === "sui" || //mo平台20250911不支持：sui
        val === "aptos" //mo平台20250911不支持：aptos
    );
}
// 判断是否 SPL 链
function isTChainSpl(val) {
    return val === "sol";
}
// 判断是否 EVM 链
function isTChainEvm(val) {
    return (val === "eth" ||
        val === "bsc" ||
        val === "base" ||
        val === "aval" ||
        val === "arb" ||
        val === "linea" ||
        val === "pulse" ||
        val === "polygon" ||
        val === "optimism" ||
        val === "moonbeam" ||
        val === "gnosis" ||
        val === "ronin" ||
        val === "fantom" || // （mo、cg、gp 平台都支持）
        val === "cronos" ||
        val === "lisk" ||
        val === "chiliz" ||
        val === "blast" || // mo 平台 20250911 不支持：blast（cg、gp 平台支持）
        val === "sonic" || // mo 平台 20250911 不支持：sonic（cg、gp 平台支持）
        val === "hyper" ||
        val === "sei" ||
        val === "uni" ||
        val === "x-layer" // mo 平台 20250911 不支持：x-layer（cg、gp 平台支持）
    );
}
// 判断是否 TVM 链
function isTChainTvm(val) {
    return val === "tron"; //mo平台20250911不支持：tron
}
// 判断是否 FVM 链
function isTChainFvm(val) {
    return val === "flow"; //mo平台20250911不支持：flow--token prices
}
// 判断是否 TAO 链
function isTChainTao(val) {
    return val === "bittensor"; //mo平台20250911不支持：bittensor
}
// 判断是否 MOVE 链
function isTChainMove(val) {
    return val === "sui" || //mo平台20250911不支持：sui
        val === "aptos"; //mo平台20250911不支持：aptos
}
exports.SUPPORT_QT = ['5m', '1h', '6h', '24h']; //所有支持的时间段
exports.SUPPORT_QT_FILE_LIST = ['6h', '24h']; //可以:保存/读取的--文件:时间段
exports.SUPPORT_QT_CACHE_LIST = ['6h', '24h']; //可以:保存/读取的--缓存:时间段
function isTQtType(val) {
    // 性能比：return ["5m", "1h", "6h", "24h"].includes(val);更高
    return val === "5m" || val === "1h" || val === "6h" || val === "24h";
}
function isTTabTypeServer(tab) {
    // 性能比：return ["trending_pools", "new_pools"].includes(tab);更高
    return tab === "trending_pools" || tab === "new_pools";
}
function isTTabTypeClient(tab) {
    return tab === "hot" || tab === "new";
}
// ==== 常量数组 ====
// 运行时常量数组（自动推导为 readonly tuple，类型就是 TChainQtKey[]）
exports.ALL_CHAIN_QT_KEYS = [
    // SPL
    "sol_5m", "sol_1h", "sol_6h", "sol_24h",
    // EVM
    "eth_5m", "eth_1h", "eth_6h", "eth_24h",
    "bsc_5m", "bsc_1h", "bsc_6h", "bsc_24h",
    "base_5m", "base_1h", "base_6h", "base_24h",
    "aval_5m", "aval_1h", "aval_6h", "aval_24h",
    "arb_5m", "arb_1h", "arb_6h", "arb_24h",
    "linea_5m", "linea_1h", "linea_6h", "linea_24h",
    "pulse_5m", "pulse_1h", "pulse_6h", "pulse_24h",
    "polygon_5m", "polygon_1h", "polygon_6h", "polygon_24h",
    "optimism_5m", "optimism_1h", "optimism_6h", "optimism_24h",
    "moonbeam_5m", "moonbeam_1h", "moonbeam_6h", "moonbeam_24h",
    "gnosis_5m", "gnosis_1h", "gnosis_6h", "gnosis_24h",
    "ronin_5m", "ronin_1h", "ronin_6h", "ronin_24h",
    "fantom_5m", "fantom_1h", "fantom_6h", "fantom_24h",
    "cronos_5m", "cronos_1h", "cronos_6h", "cronos_24h",
    "lisk_5m", "lisk_1h", "lisk_6h", "lisk_24h",
    "chiliz_5m", "chiliz_1h", "chiliz_6h", "chiliz_24h",
    "blast_5m", "blast_1h", "blast_6h", "blast_24h",
    "sonic_5m", "sonic_1h", "sonic_6h", "sonic_24h",
    "hyper_5m", "hyper_1h", "hyper_6h", "hyper_24h",
    "sei_5m", "sei_1h", "sei_6h", "sei_24h",
    "uni_5m", "uni_1h", "uni_6h", "uni_24h",
    "x-layer_5m", "x-layer_1h", "x-layer_6h", "x-layer_24h",
    // TVM
    "tron_5m", "tron_1h", "tron_6h", "tron_24h",
    // FVM
    "flow_5m", "flow_1h", "flow_6h", "flow_24h",
    // TAO
    "bittensor_5m", "bittensor_1h", "bittensor_6h", "bittensor_24h",
    // Move
    "sui_5m", "sui_1h", "sui_6h", "sui_24h",
    "aptos_5m", "aptos_1h", "aptos_6h", "aptos_24h",
];
