import { TChainName } from "./chain_type";
export declare enum EAPIPLATFORM {
    MORALIS = 1,
    SOLSCAN = 2,
    COINGECKO = 3,
    GOPLUS = 4
}
export type trending_pools_cg = {
    [key in TChainName]: string;
};
export declare function get_trendingPools_usePlatform(chainName: TChainName): EAPIPLATFORM;
export declare function get_tokenPools_usePlatform(chainName: TChainName): EAPIPLATFORM;
export declare function get_poolAddressOhlcvsPlatform(chainName: TChainName): EAPIPLATFORM;
export declare function get_tokenAddressOhlcvs_usePlatform(chainName: TChainName): EAPIPLATFORM;
export declare function get_poolAddressTrades_usePlatform(chainName: TChainName): EAPIPLATFORM;
export declare function get_tokenAddressTrades_usePlatform(chainName: TChainName): EAPIPLATFORM;
