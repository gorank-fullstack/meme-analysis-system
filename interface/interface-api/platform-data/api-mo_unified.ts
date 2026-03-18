import { TChainName } from "@gr/interface-base";
import { IMoSplTokenMeta, IMoSplMetaplexInfo } from "./api-mo_spl";
import { IMoEvmTokenMeta } from "./api-mo_evm";

// =========================
// 统一的链接结构（EVM/SPL 超集）
// =========================
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
    email?: string;    // EVM 有
    moralis?: string;  // 两边都有
}

// =============================
// SPL 专属字段
// =============================
export interface IMoSplSpecial {
    mint: string;
    standard: string;                 // 例如 "metaplex"
    metaplex: IMoSplMetaplexInfo;
}

// =============================
// EVM 专属字段
// =============================
export interface IMoEvmSpecial {
    circulating_supply: string;
    market_cap: string;
    thumbnail: string;
    block_number: string;
    created_at: string;            // ISO
    validated: number;             // 1 表示已校验
    verified_contract: boolean;
    possible_spam: boolean;
    categories: string[];
    security_score: number | null;
}

// =============================
// 统一接口（公共字段 + 专属容器）
// =============================
// 假定你已有：type TChainName = "eth" | "sol";
export interface IMoUnifiedTokenMeta {
    // 基础归一化标识
    chain: TChainName;
    // id: string;                // eth: address / sol: mint
    // address?: string;          // 仅 EVM
    // mint?: string;             // 仅 SPL

    // 基础信息
    name: string;
    symbol: string;
    decimals: string;          // 原样保留字符串
    decimals_n?: number;       // 便于运算的 number（可选）
    logo: string;
    // thumbnail?: string;         // 仅 EVM

    // 供应 / 估值（两端可统一）
    total_supply: string;             // EVM: total_supply / SPL: totalSupply
    total_supply_formatted: string;   // EVM: total_supply_formatted / SPL: totalSupplyFormatted
    fdv: string;                      // EVM: fully_diluted_valuation / SPL: fullyDilutedValue

    // 描述与链接
    description: string;
    links: IMoTokenLinks;

    // 专属字段容器
    moEvm: IMoEvmSpecial | null;
    moSpl: IMoSplSpecial | null;

    // 缓存时间（自定义）
    gr_cache_t_sec: number;
}

// =============================
// 封装函数：EVM -> 统一
// =============================
export function unifyMoFromEvm(src: IMoEvmTokenMeta, chain: TChainName = "eth"): IMoUnifiedTokenMeta {
    const decimals_n = Number.isFinite(Number(src.decimals)) ? Number(src.decimals) : undefined;

    return {
        chain,
        name: src.name,
        symbol: src.symbol,
        decimals: src.decimals,
        decimals_n,
        logo: src.logo,

        total_supply: src.total_supply,
        total_supply_formatted: src.total_supply_formatted,
        fdv: src.fully_diluted_valuation,

        description: src.description,     // EVM 是 string，直接用
        links: src.links,                 // ✅ 直接赋值

        moEvm: {
            circulating_supply: src.circulating_supply,
            market_cap: src.market_cap,
            thumbnail: src.thumbnail,       // 你已改为 EVM 专属
            block_number: src.block_number,
            created_at: src.created_at,
            validated: src.validated,
            verified_contract: src.verified_contract,
            possible_spam: src.possible_spam,
            categories: src.categories,
            security_score: src.security_score, // 允许 null
        },
        moSpl: null,

        gr_cache_t_sec: src.gr_cache_t_sec,
    };
}


// =============================
// 封装函数：SPL -> 统一
// =============================
export function unifyMoFromSpl(src: IMoSplTokenMeta, chain: TChainName = "sol"): IMoUnifiedTokenMeta {
    const decimals_n = Number.isFinite(Number(src.decimals)) ? Number(src.decimals) : undefined;

    return {
        chain,
        name: src.name,
        symbol: src.symbol,
        decimals: src.decimals,
        decimals_n,
        logo: src.logo,

        total_supply: src.totalSupply,                 // 统一命名
        total_supply_formatted: src.totalSupplyFormatted,
        fdv: src.fullyDilutedValue,

        //   description: src.description ?? "",            // ⚠️ SPL 可能为 null，这里兜底
        description: src.description,     // Spl的：description类，已经改为： string 类型
        links: src.links,                              // ✅ 直接赋值

        moEvm: null,
        moSpl: {
            mint: src.mint,                              // 你在 IMoSplSpecial 中新增的必须字段
            standard: src.standard,
            metaplex: src.metaplex,
        },

        gr_cache_t_sec: src.gr_cache_t_sec,
    };
}

// =============================
// 类型守卫（便于详情页收窄类型）
// =============================
export function isEvm(meta: IMoUnifiedTokenMeta): meta is IMoUnifiedTokenMeta & { moEvm: IMoEvmSpecial } {
    return meta.chain === "eth" && meta.moEvm !== null;
}
export function isSpl(meta: IMoUnifiedTokenMeta): meta is IMoUnifiedTokenMeta & { moSpl: IMoSplSpecial } {
    return meta.chain === "sol" && meta.moSpl !== null;
}