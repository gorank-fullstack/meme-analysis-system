import { IDataItemRaw } from "@gr/interface-api/platform-data";
import {
    DEFAULT_RAY_LAUNCHLAB,

    SOL_PUMP_FUN_PROGRAM_IDS,
    SOL_BONK_FUN_PROGRAM_IDS,
    SOL_BONK_HINT_ACCOUNTS,

    // LOG_HINT_PUMP_CREATE,
    // LOG_HINT_BONK_CREATE,
    // LOG_HINT_BONK_KEY,
} from "@gr/interface-base";

// 工具：把逗号分隔的地址串转成 Set，顺带去空格/空项
const csvToSet = (csv: string) =>
    new Set(csv.split(",").map((s) => s.trim()).filter(Boolean));

const BONK_PLATFORM_IDS = csvToSet(SOL_BONK_FUN_PROGRAM_IDS);
const BONK_HINT_ACCOUNTS = csvToSet(SOL_BONK_HINT_ACCOUNTS);
const PUMP_FUN_IDS = csvToSet(SOL_PUMP_FUN_PROGRAM_IDS);

// 依赖你前面定义好的 IDataItemRaw / IParsedInstructionRaw / IActivityRaw 等接口
export function detectLaunchPlatform(tx: IDataItemRaw): "bonk" | "pump" | null {
  // ✅ 先判断 pump（无需 Raydium 场景）
  if (isPumpLaunch(tx)) return "pump";

  // 再判断 bonk（需要 Raydium + 线索）
  if (isBonkLaunch(tx)) return "bonk";

  return null;
}

/**
 * 判定是否为 pump.fun 发射
 * 规则：
 * 1) 必须涉及 Raydium LaunchLab（program_id = DEFAULT_RAY_LAUNCHLAB 或 program = "raydium_launchpad"）
 * 2) 在相关指令（含内层指令）中出现 outer_program_id / program_id 命中 PUMP_FUN_IDS
 * 3) 兜底：若 programs_involved 同时包含 Raydium LaunchLab 与任一 pump.fun ID 也算
 */
export function isPumpLaunch(tx: IDataItemRaw): boolean {
    const pis = tx.parsed_instructions ?? [];
  
    // 1) 外层/内层 program_id / outer_program_id 命中 pump
    for (const pi of pis) {
      if (PUMP_FUN_IDS.has(String(pi.program_id ?? ""))) return true;
      if (PUMP_FUN_IDS.has(String(pi.outer_program_id ?? ""))) return true;
      for (const inner of pi.inner_instructions ?? []) {
        if (PUMP_FUN_IDS.has(String(inner.program_id ?? ""))) return true;
        if (PUMP_FUN_IDS.has(String(inner.outer_program_id ?? ""))) return true;
      }
    }
  
    // 2) 名称提示
    if (pis.some(pi => (pi.program ?? "").toLowerCase() === "pump")) return true;
    for (const pi of pis) {
      for (const act of pi.activities ?? []) {
        const n = (act.name ?? "").toLowerCase();
        if (n.includes("pumpfun")) return true;
      }
    }
  
    // 3) programs_involved 兜底
    if ((tx.programs_involved ?? []).some(p => PUMP_FUN_IDS.has(String(p)))) {
      return true;
    }
  
    return false;
  }

/**
 * 判定是否为 bonk 发射
 * 规则：
 * 1) 命中活动：RaydiumLaunchPadCreatePool（defi_pool_create）
 *    且 activities.data.extra_data.platform ∈ BONK_PLATFORM_IDS
 * 2) 兜底：若本笔 tx 涉及 Raydium LaunchLab（program = "raydium_launchpad"）
 *    且 account_keys 中出现 BONK_HINT_ACCOUNTS 里的任一地址，也算 bonk 发射
 */
export function isBonkLaunch(tx: IDataItemRaw): boolean {
    // --- 规则 1：通过活动里的 platform 精确识别
    for (const pi of tx.parsed_instructions ?? []) {
        for (const act of pi.activities ?? []) {
            // 名称在你样例中是 RaydiumLaunchPadCreatePool；类型是 defi_pool_create
            if (
                act.activity_type === "defi_pool_create" &&
                act.name === "RaydiumLaunchPadCreatePool"
            ) {
                const data = act.data as
                    | {
                        extra_data?: { platform?: string };
                    }
                    | undefined;

                const platform = data?.extra_data?.platform?.trim();
                if (platform && BONK_PLATFORM_IDS.has(platform)) return true;
            }
        }
    }

    // --- 规则 2：兜底（弱信号联合）
    // 条件：本 tx 涉及 raydium_launchpad + 出现任一 bonk 提示账号
    const involvesRaydium =
        (tx.parsed_instructions ?? []).some(
            (pi) =>
                pi.program === "raydium_launchpad" ||
                String(pi.program_id) === DEFAULT_RAY_LAUNCHLAB
        ) ||
        (tx.programs_involved ?? []).some((id) => id === DEFAULT_RAY_LAUNCHLAB);

    if (involvesRaydium) {
        for (const k of tx.account_keys ?? []) {
            if (BONK_HINT_ACCOUNTS.has(k.pubkey)) return true;
        }
    }

    return false;
}
