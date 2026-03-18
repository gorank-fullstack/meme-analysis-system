// import { ISolSplTokenItem, ISolSplTokenListResponse } from "@/interface/sol_spl";
// import axios from 'axios';
import { nestAxios } from "@/utils/nest_axios";
// import { createAxiosClient } from "@/unit/nest_axios";

import {
    ISolSplTokenItem,
    // ISolSplTokenListResponse,
} from "@gr/interface-api/platform-data";
import {TQtType, TTabType_Server} from "@gr/interface-base";
import { 
    // IGrTokenSortItem_Client, 
    IGrTokenSortPageResult_Client,  } from "@gr/interface-api/uniform-data";
const API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || ""; // 或直接硬编码

export const getTrendingTokens_v2 = async (
    chainName: string,
    tabType_Server: TTabType_Server,
    qtType: TQtType,
    currentPage:number,
    // nest_url: string,
    // chain: string = "",
    // limit: number = 100
// ): Promise<IGrTokenSortItem_Client[]> => {
): Promise<IGrTokenSortPageResult_Client> => {
    try {
        // const chainParam = chain ? `&chain=${chain}` : "";
        // const url = `https://deep-index.moralis.io/api/v2.2/tokens/trending?limit=${limit}${chainParam}`;
        // const url = `${nest_url}/sol/sol/token_list/created_time`;
        // const url =`/sol/sol/token_list/created_time`;
        /* let durationParam="";
        if(tabType==="trending_pools"){
            durationParam="/1h";
        }
 */
        // const url =`/api-gr/${chainType}/${tabType}/1${durationParam}`;
        // /task-gr 没有：duration参数。查询：trending_pools时，是返回 1h+6h的合并结果
        // const url =`/task-gr/${chainType}/${tabType}`;
        const url = `/task-gr/${chainName}/${tabType_Server}_${qtType}/${currentPage}`;
        const start1 = performance.now();
        // const response = await fetch(url);
        // const response = await axios.get(url);
        // const response = await nestAxios.get(url);
        /* const response =await nestAxios.get(url);
        const tokenList: IGrTokenSortItem[] = response.data; */
        // const { data: tokenList } = await nestAxios.get<IGrTokenSortItem[]>(url);
        // const tokenList = await nestAxios.getJson<IGrTokenSortItem_Client[]>(url);
        const { maxPage, list } = await nestAxios.getJson<IGrTokenSortPageResult_Client>(url);

        console.log('list=', list);
        const end1 = performance.now();


        // console.log(`await fetch(url) 执行时间: ${(end1 - start1).toFixed(4)} 毫秒`);
        console.log(`await nestAxios.get(url) 执行时间: ${(end1 - start1).toFixed(4)} 毫秒`);
        console.log("Fetching trending tokens from:", url);
        /* console.log('fetchTransactions response.ok=', response.ok);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        } */
        const jsonStart = performance.now();
        // const tokenList: ISolSplTokenListResponse = await response.json();
        // const tokenList: ISolSplTokenListResponse = response.data;
        // const tokenList: IGrTokenSortItem[] = response;
        const jsonEnd = performance.now();
        console.log(`response.json() 反序列化耗时: ${(jsonEnd - jsonStart).toFixed(4)} 毫秒`);
        console.log("ISolSplTokenListResponse:", list);

        // 返回统一数组结构（兼容 result 或直接返回数组的情况）
        /* if (Array.isArray(tokenList.data)) {
            return tokenList.data;            
        } */
        if (Array.isArray(list)) {
            return {
                maxPage,
                list,
            };
            // return tokenList;
        }


        return {
            maxPage:0,
            list:[],
        };
    } catch (error) {
        console.error("Error fetching trending tokens:", error);
        throw error;
    }
};

export const getTrendingTokens_v1_del = async (
    chain: string = "",
    limit: number = 100
): Promise<ISolSplTokenItem[]> => {
    try {
        const chainParam = chain ? `&chain=${chain}` : "";
        const url = `https://deep-index.moralis.io/api/v2.2/tokens/trending?limit=${limit}${chainParam}`;


        console.log("Fetching trending tokens from:", url);

        const response = await fetch(url, {
            headers: {
                accept: "application/json",
                "X-API-Key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await response.json();

        // 返回统一数组结构（兼容 result 或直接返回数组的情况）
        if (Array.isArray(data)) {
            return data as ISolSplTokenItem[];
        }

        if (Array.isArray(data.result)) {
            return data.result as ISolSplTokenItem[];
        }

        return [];
    } catch (error) {
        console.error("Error fetching trending tokens:", error);
        throw error;
    }
};
