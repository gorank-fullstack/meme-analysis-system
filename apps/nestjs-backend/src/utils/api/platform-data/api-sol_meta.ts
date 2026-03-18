import { Redis as IoRedis } from 'ioredis';
import {
    ISolSplTokenItem,
    // ISolSplTokenListResponse, ISolSplTokenMeta,
    // ISolSplTokenMetaMultiResponse,
    ISolSplTokenMetaResponse,
    // ISolSplTokenPriceMultiResponse
    // } from 'src/interface/sol_spl';
} from '@gr/interface-api/platform-data';
// import { getTokenMetaTtl } from "./ttl-utils";
import { getTokenMetaTtl } from 'src/time/ioredisTtl';
// import { isNil } from "lodash";
import { isNil } from '@nestjs/common/utils/shared.utils';

/* 
    分模块一: 尝试从 Redis 中读取 token metadata，命中的直接赋值，未命中的返回地址数组
     */
export async function load_SolSpl_TokenMeta_From_Redis(
    tokens: ISolSplTokenItem[],
    redisClient: IoRedis,
    cacheKeyPrefix: string
): Promise<string[]> {
    const addressMissList: string[] = [];

    for (const token of tokens) {
        try {
            const key_name = `${cacheKeyPrefix}${token.address}`;
            const cached = await redisClient.get(key_name);

            if (!isNil(cached)) {
                const tokenMetaParsed: ISolSplTokenMetaResponse = JSON.parse(cached);
                Object.assign(token, tokenMetaParsed.data);
            } else {
                addressMissList.push(token.address);
            }
        } catch (error) {
            console.error(`Error reading Redis for ${token.address}`, error);
            addressMissList.push(token.address);
        }
    }

    return addressMissList;
}

/* 
  分模块二: 	按 BATCH_SIZE 向 Solscan API 批量请求 ISolSplTokenItem　(包含了：meta信息) token 映射
   */
export async function fetch_SolSpl_TokenItem_From_Api(
    addresses: string[],
    batchSize: number,
    getJsonFromUrl: (url: string, errorMessage: string) => Promise<any>

): Promise<Map<string, ISolSplTokenItem>> {
    const metaMap = new Map<string, ISolSplTokenItem>();

    for (let i = 0; i < addresses.length; i += batchSize) {
        const batch = addresses.slice(i, i + batchSize);
        const caArrayLine = batch.map(addr => `address[]=${addr}`).join("&");
        const url = `https://pro-api.solscan.io/v2.0/token/meta/multi?${caArrayLine}`;

        const res = await getJsonFromUrl(url, `Error fetching batch ${i / batchSize + 1}`);

        // 把 null/非数组都归一化为空数组
        const tokenList = Array.isArray(res.data) ? res.data : [];

        for (const token of tokenList) {
            metaMap.set(token.address, token);
        }
    }

    return metaMap;
}

/* 
  分模块三: 	批量将 ISolSplTokenItem　(包含了：meta信息) 写入 Redis，封装为标准格式并设置合理 TTL
   */
export async function write_SolSpl_TokenMeta_To_Redis(
    metaMap: Map<string, ISolSplTokenItem>,
    redisClient: IoRedis,
    cacheKeyPrefix: string,
    // now: number
): Promise<void> {
    //now是时间戳
    const now = Math.floor(Date.now() / 1000);

    const tasks = Array.from(metaMap.values()).map((token) => {
        const key_name = `${cacheKeyPrefix}${token.address}`;
        const newTokenMeta: ISolSplTokenMetaResponse = {
            success: true,
            data: token,
            metadata: {},
        };

        const payload = JSON.stringify(newTokenMeta);
        const secondsAgo = token.created_time > 0 ? now - token.created_time : 3600;
        const ttl = getTokenMetaTtl(secondsAgo);

        return redisClient.setex(key_name, ttl, payload).catch(err => {
            console.error(`Redis setex error for ${key_name}`, err);
        });
    });

    await Promise.all(tasks);
}
