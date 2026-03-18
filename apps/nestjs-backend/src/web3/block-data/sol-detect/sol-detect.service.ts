// src/web3/block-data/sol-detect/sol-detect.service.ts
import { Injectable } from "@nestjs/common";
import { TPlatformType } from "@gr/interface-base";
import { SolFetchService } from "src/web3/block-data/sol-fetch/sol-fetch.service";
import { T3State } from "@gr/interface-base";

import {
    DEFAULT_RAY_LAUNCHLAB,

    SOL_PUMP_FUN_PROGRAM_IDS,
    SOL_BONK_FUN_PROGRAM_IDS,
    SOL_BONK_HINT_ACCOUNTS,

    LOG_HINT_PUMP_CREATE,
    LOG_HINT_BONK_CREATE,
    LOG_HINT_BONK_KEY,
} from "@gr/interface-base";

// 三态输出
export interface DetectOutput {
    mint: string;        // 纯 mint（仅用于输出/查最早签名）
    platform: TPlatformType; // pump 或 bonk
    state: T3State;      // -1=未知 / 0=否 / 1=是
    reason: string;      // 调试原因
}

// 可配 programId 与日志关键字（支持逗号分隔多ID）
const toIds = (s: string) => s.split(",").map(v => v.trim()).filter(Boolean);

/** 把 PublicKey | string | null | undefined 转成 base58 字符串，去掉空值 */
const toBase58List = (arr: any[]): string[] =>
    arr.map(k => (typeof k === 'string' ? k : k?.toBase58?.() ?? '')).filter(Boolean);

// 平台配置
const PLATFORM_CONF: Record<TPlatformType, {
    programIds: string[];
    logHints: RegExp[];
    accountHints?: string[]; // ← 新增
}> = {
    pump: {
        programIds: toIds(SOL_PUMP_FUN_PROGRAM_IDS),
        logHints: [LOG_HINT_PUMP_CREATE],
    },
    bonk: {
        programIds: toIds(SOL_BONK_FUN_PROGRAM_IDS),
        logHints: [LOG_HINT_BONK_CREATE, LOG_HINT_BONK_KEY],
        accountHints: toIds(SOL_BONK_HINT_ACCOUNTS ?? ''), // ← 通过 env 配 Bonk 的标识账号
    },
};


@Injectable()
export class SolDetectService {
    constructor(private readonly fetcher: SolFetchService) { }

    /** 仅核验：createTx 是否由指定平台发射（1=是，0=否，-1=未知/需重试） */
    async verifyLaunchByCreateTx(createTx: string, launchPlatform: TPlatformType)
        : Promise<{ state: T3State; reason: string }> {
        const conf = PLATFORM_CONF[launchPlatform];
        if (!conf) return { state: 0, reason: "invalid_platform" };

        const tx = await this.fetcher.getTx(createTx);
        if (!tx) return { state: -1, reason: "tx_not_found" };

        const msg: any = tx.transaction.message;
        const keys = (msg.staticAccountKeys ?? msg.accountKeys) ?? [];
        const keyStrs = toBase58List(keys);

        const instructions = msg.compiledInstructions ?? msg.instructions ?? [];
        const programIdsInTx = new Set<string>();
        const hasProgram = instructions.some((ix: any) => {
            const pid = (keyStrs[ix.programIdIndex] ?? ix.programId?.toBase58?.()) ?? '';
            if (pid) programIdsInTx.add(pid);
            return pid && conf.programIds.includes(pid);
        });

        const logs: string[] = tx.meta?.logMessages ?? [];
        const hasCreateLog = logs.some(l => conf.logHints.some(r => r.test(l)));

        // 1) 原有强阳性：program + log
        if (hasProgram && hasCreateLog) return { state: 1, reason: "program+log" };

        // 2) Bonk 特例：Raydium 路径 + Bonk 的标识账号出现（accountHints）
        //    你可以把 Raydium LaunchLab 的 programId 放到一个常量里（或直接用 programIdsInTx 判）
        const RAYDIUM_LAUNCHLAB_IDS = toIds(DEFAULT_RAY_LAUNCHLAB);
        const hasRayLaunchLab = [...programIdsInTx].some(pid => RAYDIUM_LAUNCHLAB_IDS.includes(pid));
        const hasBonkHintAccount = (conf.accountHints?.some(a => keyStrs.includes(a))) ?? false;

        if (launchPlatform === 'bonk' && hasRayLaunchLab && hasBonkHintAccount) {
            // 这类 tx 常见：Raydium LaunchLab + Metaplex + Token + Bonk PlatformConfig 出现在 accountKeys
            return { state: 1, reason: "ray_launchlab+bonk_account_hint" };
        }

        // 3) 弱阳性 / 待重试
        if (hasProgram) return { state: -1, reason: "program_only" };

        return { state: 0, reason: `no_program(${[...programIdsInTx].join(",") || "none"})` };
    }

}
