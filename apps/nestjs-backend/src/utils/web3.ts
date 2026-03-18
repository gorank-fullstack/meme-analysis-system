type ChainMap = {
    [key: string]: string;
};

const moChainName_To_moChainId_Map: ChainMap = {
    eth: "0x1",     //eth 简写
    ethereum: "0x1",

    bsc: "0x38",    //bsc 简写
    binance: "0x38",

    sol: "solana",  //sol 简写
    solana: "solana",

    polygon: "0x89",

    arb: "0xa4b1",  //arb 简写
    arbitrum: "0xa4b1",

    base: "0x2105",
    avalanche: "0xa86a",
    optimism: "0xa",
    linea: "0xe708",
    fantom: "0xfa",
    pulse: "0x171",
    ronin: "0x7e4",
};

export const get_MoChainName_To_MoChainId_Map = (chainPath: string): string => {
    return moChainName_To_moChainId_Map[chainPath] || chainPath;
};

export const get_Gp_ChainNameToId_Map: Record<string, number | string> = {
    ethereum: 1,
    eth: 1,
    bsc: 56,
    arbitrum: 42161,
    arb: 42161,
    polygon: 137,
    "zksync era": 324,
    "linea mainnet": 59144,
    base: 8453,
    scroll: 534352,
    optimism: 10,
    avalanche: 43114,
    aval: 43114,
    fantom: 250,
    cronos: 25,
    okc: 66,
    heco: 128,
    gnosis: 100,
    ethw: 10001,
    tron: "tron",            // 注意：是字符串，不是数字
    kcc: 321,
    fon: 201022,
    mantle: 5000,
    opbnb: 204,
    zkfair: 42766,
    blast: 81457,
    "manta pacific": 169,
    berachain: 80094,
    abstract: 2741,
    hashkey: 177,
    sonic: 146,
    story: 1514
};


