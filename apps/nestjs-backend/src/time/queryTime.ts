import { TChainName } from "@gr/interface-base";

export const API_GP_TOKEN_SECURITY_TIME: Record<TChainName, number> = {
    // SPL
    sol: 600,   // sol链: 上线10分钟内不获取TOKEN_SECURITY

    // EVM
    eth: 300,   // eth链: 上线5分钟内不获取TOKEN_SECURITY
    bsc: 300,   // bsc链: 上线5分钟内不获取TOKEN_SECURITY
    base: 300,
    aval: 300,
    arb: 300,
    linea: 300,
    pulse: 300,
    polygon: 300,
    optimism: 300,
    moonbeam: 300,
    gnosis: 300,
    ronin: 300,
    fantom: 300,
    cronos: 300,
    lisk: 300,
    chiliz: 300,
    blast: 300,
    sonic: 300,
    hyper: 300,
    sei: 300,
    uni: 300,
    "x-layer": 300,

    // TVM
    tron: 300,

    // FVM
    flow: 300,

    // TAO
    bittensor: 300,

    // Move
    sui: 300,
    aptos: 300,
};
