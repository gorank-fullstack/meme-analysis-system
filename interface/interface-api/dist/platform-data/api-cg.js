"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChainFromId = getChainFromId;
function getChainFromId(id) {
    if (id.startsWith("solana_"))
        return "solana";
    if (id.startsWith("bsc_"))
        return "bsc";
    if (id.startsWith("eth_"))
        return "eth";
    return "unknown";
}
//单个 token 对象
/* export interface IcgTokenItemResponse {
    data: IcgTokenItem;
} */
