// @@filename(redis-cache.service.ts)
import { Logger } from '@nestjs/common';
import { gzip, gunzip, constants as zlibConst } from "node:zlib";
import { promisify } from "node:util";

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Redis as IoRedis, type RedisKey } from 'ioredis'
// import { MISS } from "./redis.constants"
const pGzip = promisify(gzip);
const pGunzip = promisify(gunzip);

// TTL 抖动，避免同一时刻雪崩（默认 ±5%）
function withJitter(ttlSec: number, ratio = 0.05) {
    return Math.max(1, Math.floor(ttlSec * (1 + Math.random() * ratio)))
}

// 安全 JSON.parse
function safeParse<T>(s: string | null): T | null {
    if (s == null) return null;
    try { return JSON.parse(s) as T; } catch { return null; }
}

// 自定义Redis服务
@Injectable()
export class RedisCacheService {

    private readonly logger = new Logger(RedisCacheService.name);

    constructor(private readonly ioRedis: IoRedis) { }

    // --- 小工具：把 getBuffer/mgetBuffer 的 any 调用集中到一起 ---
    private async _getBuffer(key: string): Promise<Buffer | null> {
        // ioredis 实现是支持的，只是 TS 类型没声明
        return await (this.ioRedis as any).getBuffer(key);
    }
    private async _mgetBuffer(keys: string[]): Promise<(Buffer | null)[]> {
        return await (this.ioRedis as any).mgetBuffer(...keys);
    }

    // =========================
    // 单 key 读 / 写,无压缩
    // =========================

    // ---- 单 key 读：非压缩 ----
    async getKey<T = unknown>(key: string): Promise<T | null> {
        try {
          const res = await this.ioRedis.get(key);
          return safeParse<T>(res);
        } catch (e) {
          throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
      }

    // ---- 单 key 非压缩写入（value 为 undefined/null 时不写入，并提示） ----
    async setKey<T = unknown>(key: string, value: T, ttlSec = 10000): Promise<'OK' | void> {
        if (value === undefined || value === null) {
          this.logger.warn(`setKey skipped: key=${key} value is ${value as any}`);
          return;
        }
        try {
          return await this.ioRedis.set(key, JSON.stringify(value), 'EX', ttlSec);
        } catch (e) {
          throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
      }


    // =========================
    // 删 key 不需要区分是否压缩，只需实现：单key / 多key 删除
    // =========================

    // 单 key 删除
    async delKey(key: RedisKey): Promise<number> {
        try {
            // 返回被删除的 key 数：0 或 1
            return await this.ioRedis.del(key);
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }

    // 多 key 删除
    async mDelKeys(keys: RedisKey[]): Promise<number> {
        if (!keys?.length) return 0;
        try {
            // del(...keys) —— 返回删除的 key 总数
            return await this.ioRedis.del(...keys);
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }

    // =========================
    // 清空redis--仅开发环境才能执行。生产环境，要想清空redis，需要在：cli手动执行:清空命令
    // =========================
    async clearDev() {
        if (process.env.NODE_ENV !== 'development') {
            throw new HttpException(
                `[RedisCacheService] clearDev is only allowed in development environment`,
                HttpStatus.FORBIDDEN
            );
        }
        try {
            this.logger.warn(`[clearDev] Flushing ALL keys in Redis (NODE_ENV=development).`);
            return await this.ioRedis.flushall();
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }


    // =========================
    // 批量 key 读 / 循环写（JSON 字符串存储）
    // =========================

    /** 批量读取（非压缩版）：顺序与传入 keys 一一对应 */
    /* 
    mget批量读：非压缩数据的用法
    await redisCacheService.msetLoop([
    { key: 'k1', value: { a: 1 }, ttlSec: 3600 },
    { key: 'k2', value: null,     ttlSec: 3600 },
    ])

    const details = await redisCacheService.mget(['k1', 'k2'])

     */
    async mGetKeys<T = unknown>(keys: string[]): Promise<Array<T | null>> {
        if (!keys?.length) return [];
        try {
            // ioredis 的 mget 返回 (string|null)[]
            const arr = await this.ioRedis.mget(...(keys as any));
            return arr.map((s) => safeParse<T>(s));
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }

    // 批量写（非压缩版）：逐 key SET EX（跳过 undefined/null 并提示）
    async mSetKeys<T = unknown>(kvs: Array<{ key: string; value: T; ttlSec: number }>): Promise<void> {
        for (const { key, value, ttlSec } of kvs) {
            if (value === undefined || value === null) {
                this.logger.warn(`mSetKeys skipped: key=${key} value is ${value as any}`);
                continue;
            }
            await this.setKey<T>(key, value, ttlSec);
        }
    }

    // =========================
    // 单 key 写/读 压缩版 （用于超大 JSON）
    // =========================

    // 单 key 压缩写入（value 为 undefined/null 时不写入，并提示）
    async setKeyGz<T = unknown>(key: string, value: T, ttlSec = 10000): Promise<'OK' | void> {
        if (value === undefined || value === null) {
            this.logger.warn(`setKeyGz skipped: key=${key} value is ${value as any}`);
            return;
        }
        try {
            const body = JSON.stringify(value);
            // 如需更快写入，可设置压缩级别
            const gz = await pGzip(Buffer.from(body), { level: zlibConst.Z_BEST_SPEED });
            return await this.ioRedis.set(key, gz as any, 'EX', withJitter(ttlSec));
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }

    /** 单 key 压缩读取（GZIP 解压 + JSON.parse） */
    async getKeyGz<T = unknown>(key: string): Promise<T | null> {
        try {
            const buf = await this._getBuffer(key);
            if (!buf) return null;
            const raw = await pGunzip(buf);
            // 改为 safeParse，避免坏数据炸进程
            return safeParse<T>(raw.toString());
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }

    // =========================
    // 批量 key 写/读 压缩版 （用于超大 JSON）
    // =========================

    // 批量压缩写（逐 key SET EX，跳过 undefined/null 并提示）
    async mSetKeysGz<T = unknown>(kvs: Array<{ key: string; value: T; ttlSec: number }>): Promise<void> {
        for (const { key, value, ttlSec } of kvs) {
            if (value === undefined || value === null) {
                this.logger.warn(`mSetKeysGz skipped: key=${key} value is ${value as any}`);
                continue;
            }
            await this.setKeyGz<T>(key, value, ttlSec);
        }
    }

    /** 批量压缩读取：使用 mgetBuffer，顺序与 keys 一致 */
    /* mgetGz批量读：gz压缩的用法--压缩路径（大 JSON，比如 solscan 的 tx detail）
        await redisCacheService.msetGzLoop([
        { key: 'tx:abc', value: bigJsonA, ttlSec: 86400 },
        { key: 'tx:def', value: bigJsonB, ttlSec: 86400 },
        ]);

        const details = await redisCacheService.mgetGz(['tx:abc', 'tx:def']);
        
        console.log(details[0]);    // details[0] 就是 bigJsonA
        console.log(details[1]);    // details[1] 就是 bigJsonB
     */
    async mGetKeysGz<T = unknown>(keys: string[]): Promise<Array<T | null>> {
        if (!keys?.length) return [];
        try {
            const bufs = await this._mgetBuffer(keys);
            const out: Array<T | null> = [];
            for (const b of bufs) {
                if (!b) { out.push(null); continue; }
                const raw = await pGunzip(b);
                // 同样走 safeParse
                out.push(safeParse<T>(raw.toString()));
            }
            return out;
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }


    async testRedis(): Promise<string> {
        const key1: string = '要存储的key值1';
        const key2: string = '要存储的key值2';
        // 存储到redis
        // this.redisCacheService.set('要存储的key值11', '要存储的数据', 60 )  //Ttl的单位是秒
        this.setKey(key1, 'key1_value', 60)  //Ttl的单位是秒
        // this.delete([key1])
        // this.set(key2, 'key2_value', 120)  //Ttl的单位是秒
        // 读取redis
        // this.redisCacheService.get('要读取的key值11')
        const value1 = await this.getKey(key1)
        // const value2= await this.get(key2)
        console.log(key1, ' = ', value1)
        // console.log(key2,' = ',value2)
        // 删除redis
        // this.redisCacheService.delete([ '要删除的key值' ])
        // this.delete([key1,key2])
        // this.delete([key1])
        // console.log(key2,' = ', await this.get(key2))
        // this.get(key2)
        // this.clear();

        return 'success'
    }
}
