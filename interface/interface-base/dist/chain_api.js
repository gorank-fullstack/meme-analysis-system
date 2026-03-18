"use strict";
// import { TChainName, isTChainName } from "../interface-base";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EAPIPLATFORM = void 0;
exports.get_trendingPools_usePlatform = get_trendingPools_usePlatform;
exports.get_tokenPools_usePlatform = get_tokenPools_usePlatform;
exports.get_poolAddressOhlcvsPlatform = get_poolAddressOhlcvsPlatform;
exports.get_tokenAddressOhlcvs_usePlatform = get_tokenAddressOhlcvs_usePlatform;
exports.get_poolAddressTrades_usePlatform = get_poolAddressTrades_usePlatform;
exports.get_tokenAddressTrades_usePlatform = get_tokenAddressTrades_usePlatform;
// 注意：这里不能使用： "../interface-base"引入，相当于自己引入自己
const chain_type_1 = require("./chain_type");
// 枚举：支持的外部 API 平台（数值枚举）
var EAPIPLATFORM;
(function (EAPIPLATFORM) {
    EAPIPLATFORM[EAPIPLATFORM["MORALIS"] = 1] = "MORALIS";
    EAPIPLATFORM[EAPIPLATFORM["SOLSCAN"] = 2] = "SOLSCAN";
    EAPIPLATFORM[EAPIPLATFORM["COINGECKO"] = 3] = "COINGECKO";
    EAPIPLATFORM[EAPIPLATFORM["GOPLUS"] = 4] = "GOPLUS";
})(EAPIPLATFORM || (exports.EAPIPLATFORM = EAPIPLATFORM = {}));
//根据不同的：请求+链类型，返回不同的api平台
function get_trendingPools_usePlatform(chainName) {
    if ((0, chain_type_1.isTChainName)(chainName))
        return EAPIPLATFORM.COINGECKO;
    return EAPIPLATFORM.COINGECKO;
}
function get_tokenPools_usePlatform(chainName) {
    if ((0, chain_type_1.isTChainName)(chainName))
        return EAPIPLATFORM.COINGECKO;
    return EAPIPLATFORM.COINGECKO;
}
function get_poolAddressOhlcvsPlatform(chainName) {
    if ((0, chain_type_1.isTChainName)(chainName))
        return EAPIPLATFORM.COINGECKO;
    return EAPIPLATFORM.COINGECKO;
}
function get_tokenAddressOhlcvs_usePlatform(chainName) {
    if ((0, chain_type_1.isTChainName)(chainName))
        return EAPIPLATFORM.COINGECKO;
    return EAPIPLATFORM.COINGECKO;
}
function get_poolAddressTrades_usePlatform(chainName) {
    if ((0, chain_type_1.isTChainName)(chainName))
        return EAPIPLATFORM.COINGECKO;
    return EAPIPLATFORM.COINGECKO;
}
function get_tokenAddressTrades_usePlatform(chainName) {
    if ((0, chain_type_1.isTChainName)(chainName))
        return EAPIPLATFORM.COINGECKO;
    return EAPIPLATFORM.COINGECKO;
}
