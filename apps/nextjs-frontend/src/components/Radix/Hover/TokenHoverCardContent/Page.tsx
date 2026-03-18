import { SparklineCanvas } from "@/components/Chart/SparklineCanvas/Page";
import { formatNumber_fromCommon } from "@/utils/format/number";
import { formatTimeAgo_fromCommon_v2 } from "@/utils/format/time";
import { IGrTokenSortItem_Client } from "@gr/interface-api/uniform-data";

interface Props {
  token: IGrTokenSortItem_Client;
}

export function TokenHoverCardContent({ token }: Props) {
  return (
    <div className="space-y-2 text-sm leading-snug">
      <div className="font-bold text-base">{token.name} ({token.symbol})</div>
      <div>市值：${formatNumber_fromCommon(token.cmc)}</div>
      <div>持币地址数：{token.holders.total}</div>
      <div>上线时间：{formatTimeAgo_fromCommon_v2(token.c_t_sec)}</div>
      {/* <div>安全状态：{renderRiskBadge(token.riskStatus)}</div> */}
      <div>安全状态：abcd</div>
      {/* 更多字段可插入 */}
      <div className="text-[11px] text-gray-500">
        <span>{Array.isArray(token.cmc_m_arr) ? token.cmc_m_arr.join(' ') : '[]'}</span>
      </div>
      <SparklineCanvas
        data={token.cmc_m_arr ?? []}
        width={120}
        height={20}
        color={(token.cmc_m_arr?.at(-1) ?? 0) >= (token.cmc_m_arr?.[0] ?? 0) ? "#16a34a" : "#ef4444"}
      />
    </div>
  );
}
