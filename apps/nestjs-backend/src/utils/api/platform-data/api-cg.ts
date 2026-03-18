import {
    ICgPoolItem,
    ICgPoolRelationships,
    // ICgTokenRelationships,
    // ICgPoolListResponse, 
    // IcgTokenItem, IcgTokenListResponse 
} from "@gr/interface-api/platform-data";
import { T3State } from "@gr/interface-base";

type ValidQtType = "5m" | "1h" | "6h" | "24h";

export function isValidQtType(value: string): value is ValidQtType {
    return ["5m", "1h", "6h", "24h"].includes(value);
}

//获取，chainType链的：从：startPage至endPage页的：duration[时间段]趋势token对应的池子
export async function get_Cg_poolList(
    chainType: string,
    tabType: string,
    startPage: number,
    endPage: number,
    duration: string,
    getJsonFromUrlUseFree_Cg: (url: string, errorMessage: string) => Promise<any>
): Promise<ICgPoolItem[]> {
    const return_poolList: ICgPoolItem[] = [];         //不去重后的列表
    const seenBaseTokenIds = new Set<string>();

    let chainType_Api = chainType.toLowerCase();
    // 统一 chainType（支持传入 "sol"）
    if (chainType_Api === "sol") {
        chainType_Api = "solana";
    }

    for (let t_page = startPage; t_page <= endPage; t_page++) {
        let durationParam: string = "";
        if (tabType === "trending_pools") {
            durationParam = `&duration=${duration}`;
        }
        // const url = `https://api.geckoterminal.com/api/v2/networks/${chainType}/trending_pools?page=${page}&duration=${duration}`;
        const cg_url = `/networks/${chainType_Api}/${tabType}?page=${t_page}${durationParam}`;

        // await getJsonFromUrl(url, `Error fetching prices batch ${i / batchSize + 1}`);
        // const poolListResponse: {data: ICgPoolItem[]} = await getJsonFromUrlUseFree_Cg(cg_url, "Error fetching get_CgpoolList():");

        /* const res = await getJsonFromUrlUseFree_Cg(cg_url, "Error fetching get_CgpoolList():");

        const poolList: ICgPoolItem[] = res.data; */
        // const { data: poolList } = await getJsonFromUrlUseFree_Cg(cg_url, "Error fetching get_CgpoolList():");
        //res_PoolList是:访问api获取到的ICgPoolItem列表
        const res_PoolList: ICgPoolItem[] = await getJsonFromUrlUseFree_Cg(cg_url, "Error fetching get_CgpoolList():");

        // console.log('Is array:', Array.isArray(res_PoolList));
        // 把 null/非数组都归一化为空数组
        const poolList: ICgPoolItem[] = Array.isArray(res_PoolList) ? res_PoolList : [];

        // for (const item of poolListResponse.data) {
        for (const item of poolList) {
            // 注意，使用：item.relationships.base_token.data.id去重，最后可能会比maxPage*每页返回数少。
            // 因为：item.id才是每个池子的唯一值。而：item.relationships.base_token.data.id去重，每个代币出现多个池子，只加入一次
            const baseTokenId = item.relationships.base_token.data.id;
            
            // const baseTokenId = item.id;
            if (!seenBaseTokenIds.has(baseTokenId)) {
                seenBaseTokenIds.add(baseTokenId);
                return_poolList.push(item);
            }
        }
    }
    return return_poolList;
}

export function get_CgSpl_Pool_isPump(
    cgSplPoolRelationships: ICgPoolRelationships,
): T3State {
    // 对 cgSplTokenRelationships.dex?.data?.id 做安全链式检查（可选链），避免运行时错误
    // 在 cgSplTokenRelationships.dex?.data?.id 在“无值”场景下，都会返回 false，而不会抛错
    // 如果 dex?.data?.id 是 "pumpswap"，返回 1；否则返回 0
    return cgSplPoolRelationships?.dex?.data?.id === "pumpswap" ? 1 : 0;
}