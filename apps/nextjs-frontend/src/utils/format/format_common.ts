
// import { IMoSplTokenPairsResponse } from "@/interface/mo_spl";
import { IMoSplTokenPairsResponse } from "@gr/interface-api/platform-data";

// 定义返回类型：包含显示文本和对应颜色的类名
export interface ITransTypeInfo_V1 {
    text: string;
    color: string;
}

export interface ITransTypeInfo_V2 {
    text: string;
    color1: string; //深色
    color2: string; //浅色
}
// 根据交易类型返回对应的显示文本和颜色
export const getTransType_V1 = (type: string | null | undefined): ITransTypeInfo_V1 => {
    // 如果类型为空，返回默认信息
    if (!type) return { text: "Unknown", color: "text-gray-500" };

    switch (type.toLowerCase()) {
        case "buy":
            return { text: "Buy", color: "text-green-500" }; // 买入
        case "sell":
            return { text: "Sell", color: "text-red-500" }; // 卖出
        case "addliquidity":
            return { text: "Add Liquidity", color: "text-pink-500" }; // 添加流动性
        case "removeliquidity":
            return { text: "Remove Liquidity", color: "text-red-500" }; // 移除流动性
        default:
            return {
                // 默认首字母大写，其余保留原样
                text: type.charAt(0).toUpperCase() + type.slice(1),
                color: "text-gray-500", // 未知类型显示灰色
            };
    }
};
export const getTransType_V2 = (type: string | null | undefined): ITransTypeInfo_V2 => {
    // 如果类型为空，返回默认信息
    if (!type) return { text: "Unknown", color1: "text-gray-500", color2: "text-gray-500" };

    switch (type.toLowerCase()) {
        case "buy":
            return { text: "Buy", color1: "text-green-500", color2: "text-green-300" }; // 买入
        case "sell":
            return { text: "Sell", color1: "text-red-500", color2: "text-red-300" }; // 卖出
        case "addliquidity":
            return { text: "Add Liquidity", color1: "text-pink-500", color2: "text-pink-300" }; // 添加流动性
        case "removeliquidity":
            return { text: "Remove Liquidity", color1: "text-red-500", color2: "text-red-300" }; // 移除流动性
        default:
            return {
                // 默认首字母大写，其余保留原样
                text: type.charAt(0).toUpperCase() + type.slice(1),
                color1: "text-gray-500", // 未知类型显示灰色
                color2: "text-gray-300",
            };
    }
};
export const getTextColor = (txType: string) => {
    switch (txType.toLowerCase()) {
        case "buy":
            return "text-green-500";
        case "sell":
            return "text-red-500";
        case "add liquidity":
            return "text-pink-500"; // 添加流动性
        case "remove liquidity":
            return "text-red-500"; // 移除流动性
        default:
            return "text-gray-400";
    }
};
/* 
// 获取基础币种（Base Token）的值和符号
const getBaseTokenValue = (
    tx: ITransaction
  ): { value: number; symbol: string } => {
    // 如果 baseTokenAmount 不存在，返回默认值
    if (!tx.baseTokenAmount) return { value: 0, symbol: "" };
  
    // 将字符串金额转为浮点数
    const value = parseFloat(tx.baseTokenAmount);
  
    // 尝试从 pairData 或 pair 中获取符号
    const symbol =
      pairData?.baseToken?.symbol || pair?.baseToken?.symbol || "";
  
    return { value, symbol };
  };

// 获取报价币种（Quote Token）的值和符号
const getQuoteTokenValue = (
    tx: ITransaction
  ): { value: number; symbol: string } => {
    // 如果 quoteTokenAmount 不存在，返回默认值
    if (!tx.quoteTokenAmount) return { value: 0, symbol: "" };
  
    // 将字符串金额转为浮点数
    const value = parseFloat(tx.quoteTokenAmount);
  
    // 取绝对值（为了显示正数金额）
    const absValue = Math.abs(value);
  
    // 获取报价币种符号
    const symbol =
      pairData?.quoteToken?.symbol || pair?.quoteToken?.symbol || "";
  
    return { value: absValue, symbol };
  }; */

/* 
Gpt:
要求：先遍历：TokenPairsRes.pairs[]数组，寻找出TokenPairsRes.pairs[index].liquidityUsd前３大的index存入数组里。
若TokenPairsRes.pairs[]数组不足３，只存前面１-2大的index到数组里
 */
/**
 * 获取 liquidityUsd 最大的前3个 token pair 的 index（不足3个时，返回现有数量）
 * @param res IMoSplTokenPairsResponse 响应数据
 * @returns number[] 最大 liquidity 的 index 数组（最多3个）
 */
/* 因：mo token_pairs　返回的结果已经按Liquidity降序排列。因此此函数，实际工作中，用不到 */
export const getTopLiquidityIndexes = (res: IMoSplTokenPairsResponse, top: number = 5): number[] => {
    if (!res || !Array.isArray(res.pairs)) return [];

    const indexedPairs = res.pairs.map((pair, index) => ({
        index,
        liquidityUsd: pair.liquidityUsd,
    }));

    const sorted = indexedPairs.sort((a, b) => b.liquidityUsd - a.liquidityUsd);

    return sorted.slice(0, top).map(item => item.index);
};

/*
Gpt:
新要求：遍历：TokenPairsRes.pairs[]数组，寻找出TokenPairsRes.pairs[index].liquidityUsd大于2000的TokenPairsRes.pairs存为新的数组。
用新数组TokenPairsRes.pairs[index].usdPrice 从小到大，排序前５个。
若TokenPairsRes.pairs[]数组不足5，只存前面１-４个的index到数组里
 */
/*
 新需求要点：
1:遍历 TokenPairsRes.pairs[]；
2:筛选出 liquidityUsd > 2000 的项；
3:按 usdPrice 从小到大排序；
4:取前最多5项；
5:返回这些项的 原始 index。
 */
/**
 * 获取 liquidityUsd > 2000 的 token pairs，按 usdPrice 升序排序，返回前5个的原始 index（若不足5，则返回实际数量）
 */
export const getSplFilteredSortedIndexes = (res: IMoSplTokenPairsResponse, liquidityLimit: number, top: number = 5): number[] => {
    if (!res || !Array.isArray(res.pairs)) return [];
    if (liquidityLimit <= 0) return [];

    // 步骤 1：先筛选出 liquidityUsd > 2000 的项，同时保留原始 index
    const filteredPairs = res.pairs
        .map((pair, index) => ({ ...pair, originalIndex: index }))
        //   .filter(pair => pair.liquidityUsd > 2000);
        .filter(pair => pair.liquidityUsd > liquidityLimit);

    // 步骤 2：按 usdPrice 从小到大排序
    const sortedPairs = filteredPairs.sort(
        (a, b) => a.usdPrice - b.usdPrice
    );

    // 步骤 3：取前5个的原始 index
    return sortedPairs.slice(0, top).map(pair => pair.originalIndex);
};


