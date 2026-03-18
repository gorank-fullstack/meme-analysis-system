import { TChainName } from "@gr/interface-base";
import { IMoSplTokenMeta, IMoSplMetaplexInfo } from "./api-mo_spl";
import { IMoEvmTokenMeta } from "./api-mo_evm";
export interface IMoTokenLinks {
    discord?: string;
    medium?: string;
    reddit?: string;
    telegram?: string;
    twitter?: string;
    website?: string;
    github?: string;
    bitbucket?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
    email?: string;
    moralis?: string;
}
export interface IMoSplSpecial {
    mint: string;
    standard: string;
    metaplex: IMoSplMetaplexInfo;
}
export interface IMoEvmSpecial {
    circulating_supply: string;
    market_cap: string;
    thumbnail: string;
    block_number: string;
    created_at: string;
    validated: number;
    verified_contract: boolean;
    possible_spam: boolean;
    categories: string[];
    security_score: number | null;
}
export interface IMoUnifiedTokenMeta {
    chain: TChainName;
    name: string;
    symbol: string;
    decimals: string;
    decimals_n?: number;
    logo: string;
    total_supply: string;
    total_supply_formatted: string;
    fdv: string;
    description: string;
    links: IMoTokenLinks;
    moEvm: IMoEvmSpecial | null;
    moSpl: IMoSplSpecial | null;
    gr_cache_t_sec: number;
}
export declare function unifyMoFromEvm(src: IMoEvmTokenMeta, chain?: TChainName): IMoUnifiedTokenMeta;
export declare function unifyMoFromSpl(src: IMoSplTokenMeta, chain?: TChainName): IMoUnifiedTokenMeta;
export declare function isEvm(meta: IMoUnifiedTokenMeta): meta is IMoUnifiedTokenMeta & {
    moEvm: IMoEvmSpecial;
};
export declare function isSpl(meta: IMoUnifiedTokenMeta): meta is IMoUnifiedTokenMeta & {
    moSpl: IMoSplSpecial;
};
