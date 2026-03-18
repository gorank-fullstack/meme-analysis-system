

import { IGrTokenSortItem_Client } from '@gr/interface-api/uniform-data';
import { Redis as IoRedis } from 'ioredis';
import { getFullPath_4_Param_Fast_All_Slash } from 'src/utils/path';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { IRawGpEvmTokenSecurityInfo, IRawGpEvmTokenSecurityResponse, IRawGpSplTokenSecurityInfo, IRawGpSplTokenSecurityResponse } from '@gr/interface-api/platform-safe';
import {
    // set_GpEvm_TokenSecurity_To_Gr_Token_old as set_GpEvm_TokenSecurity_To_Gr_Token_old,
    // set_GpSpl_TokenSecurity_To_Gr_Token_old as set_GpSpl_TokenSecurity_To_Gr_Token_old,
    set_GpEvm_TokenSecurity_To_Gr_Token,
    set_GpSpl_TokenSecurity_To_Gr_Token,
    set_MoEvm_TokenMeta_To_Gr_Token,
    set_SolSpl_TokenMeta_To_Gr_Token
} from './api-gr_token_set';

import { getTokenMetaTtl, getTokenSecurityTtl } from 'src/time/ioredisTtl';
import { IMoEvmTokenMeta, ISolSplTokenItem, ISolSplTokenMetaResponse } from '@gr/interface-api/platform-data';
import { API_GP_TOKEN_SECURITY_TIME } from 'src/time/queryTime';
import { API_GP_CODE } from 'src/status-code/API_GP_CODE';
import { TChainName } from '@gr/interface-base';


//------------【第一部分: 遍历每个 token，尝试读取 Redis 缓存作为 TokenSecurity】************************------------
export async function load_Gp_TokenSecurity_From_Redis(
    grTokenSortList: IGrTokenSortItem_Client[],
    redisClient: IoRedis,
    mapAddressToCreateTime: Map<string, number>,
    // cacheKeyPrefix: string
    cacheKeyHead: string,
    cacheKeyMiddle: string,
): Promise<string[]> {
    const addressMissList: string[] = [];

    let hitCount: number = 0;  //缓存:命中--次数
    let missCount: number = 0; //缓存:未命中--次数
    let skipCount: number = 0; //上线时间太短,不获取 TokenSecurity 信息:跳过--次数
    let errorCount: number = 0;//缓存格式错误

    const nowSec = Math.floor(Date.now() / 1000); // 获取当前时间戳（单位：秒）

    for (const token of grTokenSortList) {

        const chainName = token.chain;
        const caArray = token.ca;
        // 这里c_time：时间格式是(来自cg平台api)："2025-05-26T02:37:24Z"
        // const iso_time_str = token.c_time;
        // 把iso_time_str转换为：时间戳(单位：秒)
        // const timestampInSeconds = Math.floor(new Date(iso_time_str).getTime() / 1000);
        const timestampInSeconds = token.c_t_sec;

        let getDataSuccess: boolean = false;
        //计算token上线时间,距离现在多少秒
        const ageInSeconds = nowSec - timestampInSeconds;
        if (ageInSeconds < API_GP_TOKEN_SECURITY_TIME[chainName]) {
            // 跳过上线时间小于"API_GP_TOKEN_SECURITY_TIME[chainType]"的 token
            console.log(`跳过: ${caArray} (${chainName}) - 上线仅 ${ageInSeconds} 秒`);
            skipCount++;
            continue;
        }

        try {

            const cacheFullPath = getFullPath_4_Param_Fast_All_Slash(cacheKeyHead, chainName, cacheKeyMiddle, caArray);
            const cached = await redisClient.get(cacheFullPath);

            if (!isNil(cached)) {
                // console.log(`Redis hit:TokenSecurity for ${chainType}--${caArray}`);
                if (chainName === "sol") {
                    const rawGpSplTokenSecurityParsed: IRawGpSplTokenSecurityResponse = JSON.parse(cached);
                    if (rawGpSplTokenSecurityParsed.code === API_GP_CODE.OK) {
                        set_GpSpl_TokenSecurity_To_Gr_Token(rawGpSplTokenSecurityParsed, token);
                        getDataSuccess = true;
                        hitCount++;
                    } else {
                        console.log(`error:fetch_Gp_TokenSecurity_From_Api--${caArray},JSON.parse(cached)=`, JSON.parse(cached));
                        errorCount++;
                    }
                } else {
                    const rawGpEvmTokenSecurityParsed: IRawGpEvmTokenSecurityResponse = JSON.parse(cached);
                    if (rawGpEvmTokenSecurityParsed.code === API_GP_CODE.OK) {
                        set_GpEvm_TokenSecurity_To_Gr_Token(rawGpEvmTokenSecurityParsed, token);
                        getDataSuccess = true;
                        hitCount++;
                    } else {
                        console.log(`error:fetch_Gp_TokenSecurity_From_Api--${caArray},JSON.parse(cached)=`, JSON.parse(cached));
                        errorCount++;
                    }
                }
                /* const tokenMetaParsed: ISolSplTokenMetaResponse = JSON.parse(cached);
                Object.assign(token, tokenMetaParsed.data); */
            } else {
                // addressMissList.push(token.address);
                // addressMissList.push(caArray);
                // mapAddressToCreateTime.set(caArray, timestampInSeconds); //将：ca对应的池子创建时间存入map
                missCount++;
            }
        } catch (error) {
            console.error(`Error reading Redis for ${caArray}`, error);
            errorCount++;
            // addressMissList.push(caArray);
            // mapAddressToCreateTime.set(caArray, timestampInSeconds);
        }

        //获取不到TokenSecurity数据，存入：addressMissList[]
        if (getDataSuccess === false) {
            addressMissList.push(caArray);
            mapAddressToCreateTime.set(caArray, timestampInSeconds);
            missCount++;
        }
    }//END for
    console.log(`-->>TokenSecurity--Redis--命中次数：${hitCount}--未命中次数：${missCount}--跳过次数：${skipCount}--格式错误：${errorCount}`);

    return addressMissList;
}


//------------【第二部分(之二): 遍历：tokenSecurityMap ,并根据 token 的创建时间动态获得 Ttl，写入缓存  ------------
export async function write_Gp_TokenSecurity_To_Redis(
    chainName: TChainName,
    tokenSecurityMap: Map<string, any>,
    redisClient: IoRedis,
    map_AddressWithout_TokenSecurity_To_CreateTime: Map<string, number>,
    // cacheKeyPrefix: string,
    cacheKeyHead: string,
    cacheKeyMiddle: string,
    // now: number
): Promise<void> {
    const nowSec = Math.floor(Date.now() / 1000);

    // 使用：metaMap.values()遍历只能，拿到：metaMap的单项values
    // const tasks = Array.from(metaMap.values()).map((token) => {
    // 改用 metaMap.entries() 来拿到 key 和 value：
    const tasks = Array.from(tokenSecurityMap.entries()).map(([address, tokenSecurity]) => {
        // const key_name = `${cacheKeyPrefix}${token.address}`;
        const cacheFullPath = getFullPath_4_Param_Fast_All_Slash(cacheKeyHead, chainName, cacheKeyMiddle, address);

        let payload: string = "";
        // Gpt:无论 tokenSecurity 是字符串、还是对象、对象数组，都可以安全地使用 JSON.stringify()
        if(chainName==='sol'){
            const rawSplTokenSecurityInfo: IRawGpSplTokenSecurityInfo = {
                ...tokenSecurity,
                //手动填写：gr_cache_t_sec，以后续 更新/补齐 数据时，判断是否最新
                gr_cache_t_sec: nowSec,
            };
            payload = JSON.stringify(rawSplTokenSecurityInfo);
        }else{
            const rawEvmTokenSecurityInfo: IRawGpEvmTokenSecurityInfo = {
                ...tokenSecurity,
                //手动填写：gr_cache_t_sec，以后续 更新/补齐 数据时，判断是否最新
                gr_cache_t_sec: nowSec,
            };
            payload = JSON.stringify(rawEvmTokenSecurityInfo);
        }
        
        const tokenCreateTime = map_AddressWithout_TokenSecurity_To_CreateTime.get(address);
        // const iso_time_str = createTime ?? new Date(Date.now() - 3600 * 1000).toISOString();
        // const timestampInSeconds = createTime ?? new Date(Date.now() - 3600 * 1000);
        const timestampInSeconds = tokenCreateTime ?? Math.floor((Date.now() - 3600 * 1000) / 1000);

        const secondsAgo = timestampInSeconds > 0 ? nowSec - timestampInSeconds : 3600;
        // const secondsAgo = token.created_time > 0 ? now - token.created_time : 3600;
        const ttl = getTokenSecurityTtl(secondsAgo);

        return redisClient.setex(cacheFullPath, ttl, payload).catch(err => {
            console.error(`Redis setex error for ${cacheFullPath}`, err);
        });
    });

    await Promise.all(tasks);
}


//------------【第三部分: 遍历每个 token，尝试读取 Redis 缓存作为 Token Meta】************************------------
export async function load_MoEvm_Or_SolSpl_TokenMeta_From_Redis(
    grTokenSortList: IGrTokenSortItem_Client[],
    redisClient: IoRedis,
    map_AddressWithout_TokenMeta_To_CreateTime: Map<string, number>,
    // cacheKeyPrefix: string
    cacheKeyHead_Mo: string,
    cacheKeyHead_Sol: string,
    cacheKeyMiddle: string,
): Promise<string[]> {
    const addressWithoutList: string[] = [];

    for (const token of grTokenSortList) {
        const chainName = token.chain;
        const ca = token.ca;
        // 这里c_time：时间格式是(来自cg平台api)："2025-05-26T02:37:24Z"
        // const iso_time_str = token.c_time;
        // 把iso_time_str转换为：时间戳(单位：秒)
        // const timestampInSeconds = Math.floor(new Date(iso_time_str).getTime() / 1000);
        const timestampInSeconds = token.c_t_sec;

        try {
            let cacheKeyHead: string = "";
            if (chainName === "sol") {
                cacheKeyHead = cacheKeyHead_Sol;
            } else {
                cacheKeyHead = cacheKeyHead_Mo;
            }
            const cacheFullPath = getFullPath_4_Param_Fast_All_Slash(cacheKeyHead, chainName, cacheKeyMiddle, ca);

            const cached = await redisClient.get(cacheFullPath);

            if (!isNil(cached)) {
                console.log(`Redis hit:MoEvm_Or_SolSpl_TokenMeta for ${chainName}--${ca}`);

                if (chainName === "sol") {
                    // const gpSplTokenSecurityParsed: IGpSplTokenSecurityResponse = JSON.parse(cached);
                    const solSplTokenMetaParsed: ISolSplTokenMetaResponse = JSON.parse(cached);
                    // set_GpSpl_TokenSecurity_To_Gr_Token(gpSplTokenSecurityParsed, token);
                    set_SolSpl_TokenMeta_To_Gr_Token(solSplTokenMetaParsed.data, token);

                } else {
                    const moEvmTokenMetaListParsed: IMoEvmTokenMeta[] = JSON.parse(cached);
                    if (moEvmTokenMetaListParsed.length > 0) {
                        set_MoEvm_TokenMeta_To_Gr_Token(moEvmTokenMetaListParsed[0], token);
                    }

                }

            } else {
                // addressMissList.push(token.address);
                addressWithoutList.push(ca);
                map_AddressWithout_TokenMeta_To_CreateTime.set(ca, timestampInSeconds); //将：ca对应的池子创建时间存入map
            }
        } catch (error) {
            console.error(`Error reading Redis for ${ca}`, error);
            addressWithoutList.push(ca);
            map_AddressWithout_TokenMeta_To_CreateTime.set(ca, timestampInSeconds);
        }
    }

    return addressWithoutList;
}

//------------【第四部分(之二): 遍历：TokenMetaMap ,并根据 token 的创建时间动态获得 Ttl，写入缓存  ------------
export async function write_MoEvm_Or_SolSpl_TokenMeta_To_Redis(
    chainName: TChainName,
    tokenMetaMap: Map<string, any>,
    redisClient: IoRedis,
    // map_AddressWithout_TokenSecurity_To_CreateTime: Map<string, number>,
    map_AddressWithout_TokenMeta_To_CreateTime: Map<string, number>,
    cacheKeyHead_Mo: string,
    cacheKeyHead_Sol: string,
    cacheKeyMiddle: string,
    // now: number
): Promise<void> {
    const nowSec = Math.floor(Date.now() / 1000);

    let cacheKeyHead: string = "";
    if (chainName === "sol") {
        cacheKeyHead = cacheKeyHead_Sol;
    } else {
        cacheKeyHead = cacheKeyHead_Mo;
    }
    // 使用：metaMap.values()遍历只能，拿到：metaMap的单项values
    // const tasks = Array.from(metaMap.values()).map((token) => {
    // 改用 metaMap.entries() 来拿到 key 和 value：
    const tasks = Array.from(tokenMetaMap.entries()).map(([address, tokenMeta]) => {
        // const key_name = `${cacheKeyPrefix}${token.address}`;
        const cacheFullPath = getFullPath_4_Param_Fast_All_Slash(cacheKeyHead, chainName, cacheKeyMiddle, address);

        let payload: string = "";
        //若是：sol平台的spl链，存入缓存时，需要封装成：ISolSplTokenMetaResponse
        //因为人可能会通过url访问，若被缓存拦截器命中，就能返回正确的格式
        if (chainName === "sol") {

            const solSplTokenItem:ISolSplTokenItem={
                ...tokenMeta,
                gr_cache_t_sec:nowSec,
            }

            const newSolSplTokenMeta: ISolSplTokenMetaResponse = {
                success: true,
                data: solSplTokenItem,
                metadata: {},
                
            };
            payload = JSON.stringify(newSolSplTokenMeta);

            // 若是：Mo平台的evm链，存入缓存时，也需要封装成数组对象．即使只有一个对象
            // Mo平台的evm链，Get ERC20 token metadata by contract　无论查询单地址，还是多地址．返回的是数组对象
        } else {
            const newMoEvmTokenMeta:IMoEvmTokenMeta={
                ...tokenMeta,
                gr_cache_t_sec:nowSec,
            }
            const tokenMetaList: IMoEvmTokenMeta[] = [newMoEvmTokenMeta];
            payload = JSON.stringify(tokenMetaList);
        }
        // const payload = JSON.stringify(newTokenMeta);
        const createTime = map_AddressWithout_TokenMeta_To_CreateTime.get(address);
        const timestampInSeconds = createTime ?? Math.floor((Date.now() - 3600 * 1000) / 1000);

        // 将字符串的时间戳转换为 ：以秒为单位的时间戳
        // const timestampInSeconds = Math.floor(new Date(iso_time_str).getTime() / 1000);

        const secondsAgo = timestampInSeconds > 0 ? nowSec - timestampInSeconds : 3600;
        // const secondsAgo = token.created_time > 0 ? now - token.created_time : 3600;
        const ttl = getTokenMetaTtl(secondsAgo);

        return redisClient.setex(cacheFullPath, ttl, payload).catch(err => {
            console.error(`Redis setex error for ${cacheFullPath}`, err);
        });
    });

    await Promise.all(tasks);
}
