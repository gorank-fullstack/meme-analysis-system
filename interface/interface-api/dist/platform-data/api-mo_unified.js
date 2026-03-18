"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unifyMoFromEvm = unifyMoFromEvm;
exports.unifyMoFromSpl = unifyMoFromSpl;
exports.isEvm = isEvm;
exports.isSpl = isSpl;
// =============================
// 封装函数：EVM -> 统一
// =============================
function unifyMoFromEvm(src, chain = "eth") {
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
        description: src.description, // EVM 是 string，直接用
        links: src.links, // ✅ 直接赋值
        moEvm: {
            circulating_supply: src.circulating_supply,
            market_cap: src.market_cap,
            thumbnail: src.thumbnail, // 你已改为 EVM 专属
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
function unifyMoFromSpl(src, chain = "sol") {
    const decimals_n = Number.isFinite(Number(src.decimals)) ? Number(src.decimals) : undefined;
    return {
        chain,
        name: src.name,
        symbol: src.symbol,
        decimals: src.decimals,
        decimals_n,
        logo: src.logo,
        total_supply: src.totalSupply, // 统一命名
        total_supply_formatted: src.totalSupplyFormatted,
        fdv: src.fullyDilutedValue,
        //   description: src.description ?? "",            // ⚠️ SPL 可能为 null，这里兜底
        description: src.description, // Spl的：description类，已经改为： string 类型
        links: src.links, // ✅ 直接赋值
        moEvm: null,
        moSpl: {
            mint: src.mint, // 你在 IMoSplSpecial 中新增的必须字段
            standard: src.standard,
            metaplex: src.metaplex,
        },
        gr_cache_t_sec: src.gr_cache_t_sec,
    };
}
// =============================
// 类型守卫（便于详情页收窄类型）
// =============================
function isEvm(meta) {
    return meta.chain === "eth" && meta.moEvm !== null;
}
function isSpl(meta) {
    return meta.chain === "sol" && meta.moSpl !== null;
}
