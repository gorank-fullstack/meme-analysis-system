// import { TChainName, isTChainName } from "../interface-base";

// 注意：这里不能使用： "../interface-base"引入，相当于自己引入自己
import { TChainName, isTChainName } from "./chain_type";

// 枚举：支持的外部 API 平台（数值枚举）
export enum EAPIPLATFORM {
    MORALIS = 1,
    SOLSCAN = 2,
    COINGECKO = 3,
    GOPLUS = 4,
}


export type trending_pools_cg = {
    [key in TChainName]: string;
}

//根据不同的：请求+链类型，返回不同的api平台
export function get_trendingPools_usePlatform(chainName: TChainName): EAPIPLATFORM {
    if (isTChainName(chainName))
        return EAPIPLATFORM.COINGECKO;

    return EAPIPLATFORM.COINGECKO;
}

export function get_tokenPools_usePlatform(chainName: TChainName): EAPIPLATFORM {
    if (isTChainName(chainName))
        return EAPIPLATFORM.COINGECKO;

    return EAPIPLATFORM.COINGECKO;
}

export function get_poolAddressOhlcvsPlatform(chainName: TChainName): EAPIPLATFORM {
    if (isTChainName(chainName))
        return EAPIPLATFORM.COINGECKO;

    return EAPIPLATFORM.COINGECKO;
}

export function get_tokenAddressOhlcvs_usePlatform(chainName: TChainName): EAPIPLATFORM {
    if (isTChainName(chainName))
        return EAPIPLATFORM.COINGECKO;

    return EAPIPLATFORM.COINGECKO;
}

export function get_poolAddressTrades_usePlatform(chainName: TChainName): EAPIPLATFORM {
    if (isTChainName(chainName))
        return EAPIPLATFORM.COINGECKO;

    return EAPIPLATFORM.COINGECKO;
}

export function get_tokenAddressTrades_usePlatform(chainName: TChainName): EAPIPLATFORM {
    if (isTChainName(chainName))
        return EAPIPLATFORM.COINGECKO;

    return EAPIPLATFORM.COINGECKO;
}
