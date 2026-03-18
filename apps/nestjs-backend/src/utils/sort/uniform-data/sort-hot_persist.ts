// sort-hot.persistence.ts
import {
    SUPPORT_CHAIN, SUPPORT_QT_CACHE_LIST, SUPPORT_QT_FILE_LIST,
    TChainQtKey, TChainName, TQtType,
    TTabType_Client,
} from "@gr/interface-base";

import {
    IGrTokenSortItem_Client,
    IHot,
} from "@gr/interface-api/uniform-data";

import { CACHE_KEY_HEAD, CACHE_KEY_MIDDLE } from 'src/constant/CACHE_KEY';
//   import { IGrTokenSortItem_Client, IHot } from '../interfaces';
import { Redis as IoRedis } from 'ioredis';
import * as path from 'path';
import * as fs from 'fs/promises';

export function getLogDirPath(
    LOG_FILE_PATH: string,
    TAB_TYPE_CLIENT: TTabType_Client,
    chainType: string
): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return path.resolve(
        // __dirname 指的是：当前文件所在目录的绝对路径
        /*
        当 LOG_FILE_PATH 是绝对路径（如 /home/ubuntu/...）时，
        path.resolve(__dirname, LOG_FILE_PATH) 会忽略 __dirname，只返回 LOG_FILE_PATH 本身；
        如果是相对路径（如 ../backup），则基于 __dirname 拼接。
        */
        __dirname,
        // process.cwd() 返回的是 Node.js 执行命令时的工作目录
        // process.cwd(),
        `${LOG_FILE_PATH}/${chainType}_${TAB_TYPE_CLIENT}/${yyyy}_${MM}/${dd}`,
    );
}

export function getMapDirPath(
    MAP_FILE_PATH: string,
    TAB_TYPE_CLIENT: TTabType_Client,
    chainType: string
): string {
    return path.resolve(
        __dirname,
        // process.cwd(),
        `${MAP_FILE_PATH}/${chainType}_${TAB_TYPE_CLIENT}`,
    );
}

// 启动时--从Redis加载
export async function loadMapFromCache(
    redisClient: IoRedis,
    chainName: TChainName,
    hotGrTokenSet: Record<TChainName, Set<string>>,
    hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>>,
    hot: Record<TChainQtKey, Map<string, IHot>>,
): Promise<boolean> {
    let hasData = false;
    try {
        // 1. 从Redis 恢复：hotGrTokenSet + hotGrTokenMap
        const tokenMap_CacheFullKey = `${CACHE_KEY_HEAD.SJ_CORN_TASK_GR}/${chainName}/${CACHE_KEY_MIDDLE.TRENDING_POOLS_MAP}`;
        const tokenRaw = await redisClient.get(tokenMap_CacheFullKey);

        if (tokenRaw) {
            hotGrTokenSet[chainName].clear();
            hotGrTokenMap[chainName].clear();

            Object.entries(JSON.parse(tokenRaw)).forEach(([k, v]) => {
                hotGrTokenSet[chainName].add(k);
                hotGrTokenMap[chainName].set(k, v as IGrTokenSortItem_Client);
            });

            hasData = true;
        } else {
            console.warn(`[loadMapFromCache] No tokenMap found in Redis for ${chainName}`);
        }

        // 2. 从Redis 恢复：各时间段 hot Map（仅限6h/24h）
        for (const qt of SUPPORT_QT_CACHE_LIST) {
            const cacheKey = `${CACHE_KEY_HEAD.SJ_CORN_TASK_GR}/${chainName}/${CACHE_KEY_MIDDLE.TRENDING_POOLS}_${qt}`;
            const raw = await redisClient.get(cacheKey);

            if (raw) {
                const hotMap = hot[`${chainName}_${qt}`];
                hotMap.clear();
                Object.entries(JSON.parse(raw)).forEach(([k, v]) => {
                    hotMap.set(k, v as IHot);
                });
            } else {
                console.warn(`[loadMapFromCache] No hotMap found in Redis for ${chainName}_${qt}`);
            }
        }
    } catch (e) {
        console.error(`[loadMapFromCache] Failed to load for ${chainName}:`, e.message);
    }

    return hasData;
}

// 启动时--从文件加载
export async function loadMapFromFile(
    MAP_FILE_PATH: string,
    TAB_TYPE_CLIENT: TTabType_Client,
    TOKEN_MAP_FILE_NAME: string,
    chainName: TChainName,
    hotGrTokenSet: Record<TChainName, Set<string>>,
    hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>>,
    hot: Record<TChainQtKey, Map<string, IHot>>,
): Promise<boolean> {
    let hasData = false;
    try {
        // 1. 从File 恢复：hotGrTokenSet + hotGrTokenMap
        const fileDirPath = getMapDirPath(MAP_FILE_PATH, TAB_TYPE_CLIENT, chainName);
        const tokenRaw = await fs.readFile(
            `${fileDirPath}/${TOKEN_MAP_FILE_NAME}.json`,
            'utf8',    //读文件时,如果不加 'utf8'，它会返回 Buffer，你需要手动 .toString() 转换
        );

        if (tokenRaw) {
            hotGrTokenSet[chainName].clear();
            hotGrTokenMap[chainName].clear();

            Object.entries(JSON.parse(tokenRaw)).forEach(([k, v]) => {
                hotGrTokenSet[chainName].add(k);
                hotGrTokenMap[chainName].set(k, v as IGrTokenSortItem_Client);
            });

            hasData = true;
        } else {
            console.warn(`[loadMapFromFile] No tokenMap found in File for ${chainName}`);
        }

        // 2. 从File 恢复：各时间段 hot Map（仅限6h/24h）
        for (const qt of SUPPORT_QT_FILE_LIST) {
            const raw = await fs.readFile(`${fileDirPath}/${qt}.json`, 'utf8');
            if (raw) {
                const hotMap = hot[`${chainName}_${qt}`];
                hotMap.clear();
                Object.entries(JSON.parse(raw)).forEach(([k, v]) => {
                    hotMap.set(k, v as IHot);
                });
            } else {
                console.warn(`[loadMapFromFile] No hotMap found in File for ${chainName}_${qt}`);
            }
        }
    } catch (e) {
        console.error(`[loadMapFromFile] Failed to load for ${chainName}:`, e.message);
    }
    return hasData;
}

//保存日志到文件
export async function persistLogToFile(
    LOG_FILE_PATH: string,
    TAB_TYPE_CLIENT: TTabType_Client,
    TOKEN_MAP_FILE_NAME: string,
    hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>>,
    hot: Record<TChainQtKey, Map<string, IHot>>,
): Promise<void> {
    console.log('[persistLogToFile] 执行时间:', new Date().toISOString());

    for (const chain of SUPPORT_CHAIN) {
        const logDirPath = getLogDirPath(LOG_FILE_PATH, TAB_TYPE_CLIENT, chain);
        const writePromises: Promise<void>[] = [];
        // { recursive: true } 选项:递归创建目录：
        // 如果路径中的父目录（如 sol_client/2023_10）不存在，会自动创建所有必需的父目录。
        /* 
        对比无 recursive 的情况:
        await fs.mkdir(fileDirPath); // 不启用 recursive
        如果 sol_client 或 2023_10 不存在，会直接抛出错误。
         */
        await fs.mkdir(logDirPath, { recursive: true });

        if (hotGrTokenMap[chain].size > 0) {
            writePromises.push(
                fs.writeFile(
                    `${logDirPath}/${TOKEN_MAP_FILE_NAME}.json`,
                    JSON.stringify(Object.fromEntries(hotGrTokenMap[chain])),
                    'utf8',  // 可选参数：指定文件的字符编码(不填:默认为 'utf8')
                ),
            );
        }

        // 日志,hot仅保存:24h【后续可以根据需要，扩展到期时间段】
        // for (const qt of ['6h', '24h'] as TQtType[]) {
        for (const qt of ['24h'] as TQtType[]) {
            if (hot[`${chain}_${qt}`].size > 0) {
                writePromises.push(
                    fs.writeFile(
                        `${logDirPath}/${qt}.json`,
                        JSON.stringify(Object.fromEntries(hot[`${chain}_${qt}`])),
                        'utf8',
                    ),
                );
            }
        }

        await Promise.all(writePromises);
    }//End for
}

//保存Map到文件
export async function persistMapToFile(
    MAP_FILE_PATH: string,
    TAB_TYPE_CLIENT: TTabType_Client,
    TOKEN_MAP_FILE_NAME: string,
    hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>>,
    hot: Record<TChainQtKey, Map<string, IHot>>,
): Promise<void> {
    console.log('[persistMapToFile] 执行时间:', new Date().toISOString());
    for (const chain of SUPPORT_CHAIN) {
        const mapDirPath = getMapDirPath(MAP_FILE_PATH, TAB_TYPE_CLIENT, chain);
        const writePromises: Promise<void>[] = [];

        if (hotGrTokenMap[chain].size > 0) {
            writePromises.push(
                fs.writeFile(
                    `${mapDirPath}/${TOKEN_MAP_FILE_NAME}.json`,
                    JSON.stringify(Object.fromEntries(hotGrTokenMap[chain])),
                    'utf8',
                )
            );
        }

        // 仅保存:6h、24h
        for (const qt of SUPPORT_QT_FILE_LIST) {
            if (hot[`${chain}_${qt}`].size > 0) {
                writePromises.push(
                    fs.writeFile(
                        `${mapDirPath}/${qt}.json`,
                        JSON.stringify(Object.fromEntries(hot[`${chain}_${qt}`])),
                        'utf8',
                    )
                );
            }
        }

        await Promise.all(writePromises);
    }//End for chain
}

//保存Map到缓存
export async function persistMapToCache(
    redisClient: IoRedis,
    hotGrTokenMap: Record<TChainName, Map<string, IGrTokenSortItem_Client>>,
    hot: Record<TChainQtKey, Map<string, IHot>>,
    // ttl可选参数，默认为0，表示永不过期
    ttl: number = 0,
): Promise<void> {
    console.log('[persistMapToCache] 执行时间:', new Date().toISOString());
    for (const chain of SUPPORT_CHAIN) {
        if (hotGrTokenMap[chain].size > 0) {
            const tokenMap_CacheFullKey = `${CACHE_KEY_HEAD.SJ_CORN_TASK_GR}/${chain}/${CACHE_KEY_MIDDLE.TRENDING_POOLS_MAP}`;
            // JSON.stringify(Object.fromEntries(hotGrTokenMap[chain])) 的作用是 
            // 将指定链（如 sol/eth/bsc）的 Map 数据转换为 JSON 字符串
            const payload = JSON.stringify(Object.fromEntries(hotGrTokenMap[chain]));

            if (ttl > 0) {
                // 使用 setex 设置带过期时间的缓存（更清晰）
                await redisClient.setex(tokenMap_CacheFullKey, ttl, payload).catch(err => {
                    console.error(`Redis setex=${ttl} error for ${tokenMap_CacheFullKey}`, err);
                });
            } else {
                // 缓存刷新--永不过期
                redisClient.set(tokenMap_CacheFullKey, payload).catch(err => {
                    console.error(`Redis set error for ${tokenMap_CacheFullKey}`, err);
                });
            }

        }

        //仅保存:6h、24h
        for (const qt of SUPPORT_QT_CACHE_LIST) {
            if (hot[`${chain}_${qt}`].size > 0) {
                const cacheKey = `${CACHE_KEY_HEAD.SJ_CORN_TASK_GR}/${chain}/${CACHE_KEY_MIDDLE.TRENDING_POOLS}_${qt}`;
                const payload = JSON.stringify(Object.fromEntries(hot[`${chain}_${qt}`]));

                if (ttl > 0) {
                    // 使用 setex
                    await redisClient.setex(cacheKey, ttl, payload).catch(err => {
                        console.error(`Redis setex error for ${cacheKey}`, err);
                    });
                } else {
                    // 缓存刷新--永不过期
                    redisClient.set(cacheKey, payload).catch(err => {
                        console.error(`Redis set error for ${cacheKey}`, err);
                    });
                }

            }
        }//End for qt
    }//End for chain
}
