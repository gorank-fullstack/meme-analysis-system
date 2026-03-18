import { Option } from "@/interface/filters";

// Metric 定义（指标）
export const AVAILABLE_METRICS: Option[] = [
    { value: "tokenAge", label: "Token Age" },
    { value: "holders", label: "Holders" },
    { value: "buyers", label: "Buyers" },
    { value: "sellers", label: "Sellers" },
    { value: "netBuyers", label: "Net Buyers" },
    { value: "experiencedBuyers", label: "Experienced Buyers" },
    { value: "experiencedSellers", label: "Experienced Sellers" },
    { value: "netExperiencedBuyers", label: "Net Experienced Buyers" },
    { value: "fullyDilutedValuation", label: "Fully Diluted Valuation" },
    { value: "marketCap", label: "Market Cap" },
    { value: "usdPricePercentChange", label: "Price Change %" },
    { value: "liquidityChange", label: "Liquidity Change" },
    { value: "liquidityChangeUSD", label: "Liquidity Change USD" },
    { value: "volumeUsd", label: "Volume USD" },
    { value: "buyVolumeUsd", label: "Buy Volume USD" },
    { value: "sellVolumeUsd", label: "Sell Volume USD" },
    { value: "netVolumeUsd", label: "Net Volume USD" },
    { value: "securityScore", label: "Security Score" },
];

// 时间周期（可选时间段）
export const TIME_FRAMES: Option[] = [
    { value: "tenMinutes", label: "10 Minutes" },
    { value: "thirtyMinutes", label: "30 Minutes" },
    { value: "oneHour", label: "1 Hour" },
    { value: "fourHours", label: "4 Hours" },
    { value: "twelveHours", label: "12 Hours" },
    { value: "oneDay", label: "1 Day" },
    { value: "oneWeek", label: "1 Week" },
    { value: "oneMonth", label: "1 Month" },
];

// 比较运算符
export const OPERATORS: Option[] = [
    { value: "gt", label: "Greater Than" },
    { value: "lt", label: "Less Than" },
    { value: "eq", label: "Equal To" },
];

// 支持的链
export const CHAINS: Option[] = [
    { value: "0x1", label: "Ethereum" },
    { value: "solana", label: "Solana" },
    { value: "0x38", label: "BSC" },
    { value: "0x89", label: "Polygon" },
    { value: "0x2105", label: "Base" },
    { value: "0xa4b1", label: "Arbitrum" },
    { value: "0xa", label: "Optimism" },
    { value: "0xa86a", label: "Avalanche" },
    { value: "0x171", label: "Pulse" },
    { value: "0x7e4", label: "Ronin" },
];
