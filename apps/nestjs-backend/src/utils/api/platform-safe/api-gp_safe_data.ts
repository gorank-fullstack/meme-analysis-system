import { IRawGpEvmHolderInfo, IRawGpEvmTokenSecurityInfo, 
  IRawGpSplHolder,
  // IGpSplStatusAuthority,  
} from "@gr/interface-api/platform-safe";
import { EVM_ADDRESS_ZERO, EVM_ADDRESS_DEAD } from "@gr/interface-base";

import { T3State } from "@gr/interface-base";
import { isNullish, toLowerTrim } from "@gr/interface-utils";

// ----------------------------- Evm链 -----------------------------
// v2: evm:弃权判断--兼容空字符串代表弃权
export function is_GpEvm_OwnershipRenounced_v2(owner_address: string | null | undefined): T3State {
  if (isNullish(owner_address)) return -1;       // 未知
  const addr = toLowerTrim(owner_address);       // 允许空串

  if (
    addr === '' || // 空串也视为 renounce（GoPlus 常见返回）
    addr === EVM_ADDRESS_ZERO ||
    addr === EVM_ADDRESS_DEAD
  ) {
    return 1;
  }
  return 0;
}

//evm:貔貅判断v1
export function is_GpEvm_ScamToken_v1(token: IRawGpEvmTokenSecurityInfo): T3State {

  //合约未源的情况下．
  /* if (token.is_open_source === "0") {
    if (token.transfer_pausable === "1" || token.slippage_modifiable === "1") {
      return 1;
    }
  } */
  if (
    token.is_honeypot === "1" ||
    token.cannot_sell_all === "1" ||
    parseFloat(token.sell_tax) > 40 ||
    token.selfdestruct === "1" ||
    token.transfer_pausable === "1" ||
    token.slippage_modifiable === "1"
  ) {
    return 1; // 明确骗局
  }

  return 0;  
}

//evm:貔貅判断v2
export function is_GpEvm_ScamToken_v2(token: IRawGpEvmTokenSecurityInfo): number {

  if (
    token.is_honeypot === "1" ||
    token.cannot_sell_all === "1" ||
    parseFloat(token.sell_tax) > 40
  ) {
    return 1; // 明确骗局
  }

  if (
    token.transfer_pausable === "1" ||
    token.slippage_modifiable === "1" ||
    token.is_open_source === "0"
  ) {
    return 0.5; // 高风险，不建议参与
  }

  return 0; // 暂无危险特征
}

//evm:锁池子判断
// T3State: -1 | 0 | 1
export function is_GpEvm_LpLocked_fast(raw: IRawGpEvmTokenSecurityInfo, threshold = 0.4): T3State {
  const arr = raw.lp_holders;
  // // 与 normalize 版本保持一致：缺失/空 = -1
  if (!Array.isArray(arr) || arr.length === 0) return -1;

  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    const h = arr[i];
    if (h.is_locked === 1) {
      const p = Number.parseFloat(h.percent);
      // 下面的if是判断：“p 是不是一个正常的有限数值？”
      if (Number.isFinite(p)) {
        sum += p;
        if (sum > threshold) return 1; // 早退
      }
    }
  }
  return 0;
}

//返回:GpEvm 持币前10的：占比
export function get_GpEvm_Holders_Top10_Percent(holders: IRawGpEvmHolderInfo[]): number {
  let holdersTop10Percent = 0.0;
  const holders_top10_length = Math.min(holders.length, 10);

  for (let i = 0; i < holders_top10_length; i++) {
    const percent = parseFloat(holders[i].percent);
    if (!isNaN(percent)) {
      holdersTop10Percent += percent;
    }
  }

  return holdersTop10Percent;
}

//返回:GpSpl持币前10的：占比
export function get_GpSpl_Holders_Top10_Percent(holders: IRawGpSplHolder[]): number {
  let holdersTop10Percent = 0.0;
  const holders_top10_length = Math.min(holders.length, 10);

  for (let i = 0; i < holders_top10_length; i++) {
    const percent = parseFloat(holders[i].percent);
    if (!isNaN(percent)) {
      holdersTop10Percent += percent;
    }
  }

  return holdersTop10Percent;
}
// ----------------------------- Sol链 -----------------------------
//sol:Mnit丢弃判断：返回1 表示：Mnit丢弃
/* function is_GpSpl_Mintable(mintable: IGpSplStatusAuthority): T3State {
  
  // 字段	含义
  // authority	如果数组为空 []，代表 没有 mint 权限地址
  // status	"0" 表示 mint 权限被 丢弃；"1" 表示还存在 mint 权限
  
  if (
    mintable.status === "0" &&
    // Array.isArray(mintable.authority) && //确定：mintable.authority是数组，可以省略
    mintable.authority.length === 0) {
    return 1;
  }
  return 0;
}
 */
// Sol:冻结判断
/* function is_GpSpl_Freezable(freezable: IGpSplStatusAuthority): number {

  // 若 status === "1" 且 authority.length > 0 → 可能被项目方冻结转账
  if (freezable.status === "1" && freezable.authority.length > 0) {
    return 1;
  }
  return 0;
}
 */
// Sol:判断当前是否有【黑名单】机制.返回1 表示有黑名单
/* function has_GpSpl_BlacklistHookNow(
  transfer_hook: string[],
  non_transferable: string,
  // dex: string[]
): T3State {
  //先判断限制转账列表
  // transfer_hook.length > 0 存在黑名单逻辑 
  //non_transferable === "1"说明:这个 Token 不允许用户间随意转账（在合约层面限制了转账功能）。
  if ((Array.isArray(transfer_hook) && transfer_hook.length > 0) || non_transferable !== "0") {
    return 1;

    // }else if(non_transferable === "0" && dex?.length > 0)
  }
  
  return 0;
} */

/* export function is_GpEvm_LpLocked_old(token: IGpEvmTokenSecurityInfo): T3State {
  let lockedPercentSum = 0;

  //若：没有lp_holders字段，或lp_holders字段数组长度为0.返回0
  if (!token.lp_holders || token.lp_holders.length === 0) {
    return 0;
  }

  //遍历holder.is_locked值为1(锁池子状态)的percent，总和大于0.4时，返回1
  for (const holder of token.lp_holders) {
    if (holder.is_locked === 1) {
      const percent = parseFloat(holder.percent);
      if (!isNaN(percent)) {
        lockedPercentSum += percent;
        if (lockedPercentSum > 0.4) {
          return 1;
        }
      }
    }
  }

  return 0;
} */

/* export function gpEvm_blackListed(token: IGpEvmTokenSecurityInfo): {
  if(token.is_white_listed)
} */
//evm风险评估
/* 
export type RiskLevel = "SAFE" | "RISKY" | "DANGEROUS" | "SCAM";
export function gpEvm_evaluateTokenRisk(token: IGpEvmTokenSecurityInfo): {
  risk: RiskLevel;
  reasons: string[];
} {
  const reasons: string[] = [];

  // 明确骗局行为
  if (token.is_honeypot === "1") reasons.push("Detected honeypot");
  if (token.cannot_sell_all === "1") reasons.push("Cannot sell all tokens");
  if (parseFloat(token.sell_tax) > 40) reasons.push("Excessive sell tax");

  // 明确危险级别
  if (token.transfer_pausable === "1") reasons.push("Transfers can be paused by owner");
  if (token.slippage_modifiable === "1") reasons.push("Slippage settings modifiable");
  if (token.is_open_source === "0") reasons.push("Contract not open source");

  // 检查“是否真实弃权”
  const ownerIsZero = token.owner_address === "0x0000000000000000000000000000000000000000" || token.owner_address === "0x000000000000000000000000000000000000dead";
  const hasHiddenOwner = token.hidden_owner === "1";
  const isUpgradeable = token.is_proxy === "1";

  if (ownerIsZero) {
    if (hasHiddenOwner) {
      reasons.push("Fake renounce: hidden owner exists");
    }
    if (isUpgradeable) {
      reasons.push("Fake renounce: contract is upgradable");
    }
  } else {
    reasons.push("Owner not renounced");
  }

  // 该合约包含 selfdestruct（自毁）函数，1:表示：项目方可以销毁整个合约
  if (token.selfdestruct === "1") {
    reasons.push("Contract can self-destruct");
  }

  // 评估等级
  let risk: RiskLevel = "SAFE";

  if (
    reasons.includes("Detected honeypot") ||
    reasons.includes("Cannot sell all tokens") ||
    reasons.includes("Excessive sell tax")
  ) {
    risk = "SCAM";
  } else if (
    reasons.includes("Fake renounce: hidden owner exists") ||
    reasons.includes("Transfers can be paused by owner") ||
    reasons.includes("Contract not open source") ||
    reasons.includes("Owner not renounced") ||
    reasons.includes("Contract can self-destruct")
  ) {
    risk = "DANGEROUS";
  } else if (
    reasons.includes("Slippage settings modifiable") ||
    reasons.includes("Fake renounce: contract is upgradable")
  ) {
    risk = "RISKY";
  }

  return { risk, reasons };
} */

  
/* type TGoPlusTokenResult = {
  is_honeypot: string;
  cannot_sell_all: string;  //不能全部卖出
  sell_tax: string;
  selfdestruct: string; //值为1时，代表:合约内存在 selfdestruct 操作，项目方可调用该函数销毁合约。

  is_open_source: string;
  transfer_pausable: string;   //暂停所有转账功能
  slippage_modifiable: string; //合约支持修改最小交易滑点，或者影响买卖时滑点校验逻辑。
}; */

//evm:弃权判断--不够专业
/* export function is_GpEvm_OwnershipRenounced_v1(owner_address: string): number {
  const normalized = owner_address.toLowerCase();
  if (
    normalized === '' || // 空串也视为 renounce（GoPlus 常见返回）
    normalized === EVM_ADDRESS_ZERO ||
    normalized === EVM_ADDRESS_DEAD
  ) {
    return 1;
  }
  return 0;
} */
