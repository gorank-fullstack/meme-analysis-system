export type T3State = -1 | 0 | 1;
export type TChainName = "sol" | "eth" | "bsc" | "base" | "aval" | "arb" | "linea" | "pulse" | "polygon" | "optimism" | "moonbeam" | "gnosis" | "ronin" | "fantom" | "cronos" | "lisk" | "chiliz" | "blast" | "sonic" | "hyper" | "sei" | "uni" | "x-layer" | "tron" | "flow" | "bittensor" | "sui" | "aptos";
export type TChainSpl = "sol";
export type TChainEvm = "eth" | "bsc" | "base" | "aval" | "arb" | "linea" | "pulse" | "polygon" | "optimism" | "moonbeam" | "gnosis" | "ronin" | "fantom" | "cronos" | "lisk" | "chiliz" | "blast" | "sonic" | "hyper" | "sei" | "uni" | "x-layer";
export type TChainTvm = "tron";
export type TChainFvm = "flow";
export type TChainTao = "bittensor";
export type TChainMove = "sui" | "aptos";
export declare const SUPPORT_CHAIN: TChainName[];
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
export declare function isTChainName(val: string): val is TChainName;
export declare function isTChainSpl(val: string): val is TChainSpl;
export declare function isTChainEvm(val: string): val is TChainEvm;
export declare function isTChainTvm(val: string): val is TChainTvm;
export declare function isTChainFvm(val: string): val is TChainFvm;
export declare function isTChainTao(val: string): val is TChainTao;
export declare function isTChainMove(val: string): val is TChainMove;
export type TQtType = "5m" | "1h" | "6h" | "24h";
export type TTimeframe_PriceChange = "1h" | "6h" | "24h";
export declare const SUPPORT_QT: TQtType[];
export declare const SUPPORT_QT_FILE_LIST: TQtType[];
export declare const SUPPORT_QT_CACHE_LIST: TQtType[];
export declare function isTQtType(val: string): val is TQtType;
export type TTabType_Server = "trending_pools" | "new_pools";
export type TTabType_Client = "hot" | "new";
export declare function isTTabTypeServer(tab: string): tab is TTabType_Server;
export declare function isTTabTypeClient(tab: string): tab is TTabType_Client;
export type TChainQtKey = `${TChainName}_${TQtType}`;
export declare const ALL_CHAIN_QT_KEYS: readonly TChainQtKey[];
