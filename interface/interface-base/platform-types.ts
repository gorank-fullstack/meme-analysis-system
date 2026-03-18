export type TPlatformType = "pump" | "bonk";

// 默认 Raydium LaunchLab ProgramId（可被 env / 常量覆盖）
export const DEFAULT_RAY_LAUNCHLAB = "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"

/* 
SOL_PUMP_FUN_PROGRAM_IDS和SOL_BONK_FUN_PROGRAM_IDS
支持传入：逗号分隔的数组，也只杺只传入一个地址。
 */
export const SOL_PUMP_FUN_PROGRAM_IDS = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
export const SOL_BONK_FUN_PROGRAM_IDS = "FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1";

// 若同时出现 Raydium LaunchLab 的 programId + Bonk 的 PlatformConfig（或其它 Bonk 标识账号）在 accountKeys 里 → 也判定为 bonk 发射。
// SOL_BONK_HINT_ACCOUNTS 用来放 letsbonk.fun: PlatformConfig 等你确认过的账号地址（逗号分隔）。
export const SOL_BONK_HINT_ACCOUNTS = "FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1"

export const LOG_HINT_PUMP_CREATE = /Instruction:\s*Create/i;

export const LOG_HINT_BONK_CREATE = /Instruction:\s*Create/i;
export const LOG_HINT_BONK_KEY = /Bonk/i;

//1705622400=2024 年 1 月 19 日,是pump成立时间
export const SOL_PUMP_OLD_TOKEN_START_SECONDS = 1705622400;
//1724025600=2024 年8 月 19 日,之前pump发射的币，不是以："pump结尾"，之后发射的币是以："pump结尾"
export const SOL_PUMP_OLD_TOKEN_END_SECONDS = 1724025600;
export const SOL_PUMP_NEW_TOKEN_START_SECONDS = SOL_PUMP_OLD_TOKEN_END_SECONDS + 1;

// 创建/上线时间：确实是 2024 年 4 月 25 日左右。
// 真正走红的时间：2025 年初（大概率 1 月份之后）。
// bonk发射的币，就按：1727740800=2024年10月1日，起.之前的冷却时间，不做统计
export const SOL_BONK_NEW_TOKEN_START_SECONDS = 1727740800;