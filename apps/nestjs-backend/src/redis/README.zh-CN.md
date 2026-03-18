---

# Redis Layer（缓存层）

本目录实现了 Meme Analysis System 后端中的 **Redis 缓存层（Redis Layer）**，用于提升系统在 **高并发 / 高读频 / 大 JSON 数据场景** 下的整体性能与稳定性。

该缓存层由两部分组成：

1. **RedisCacheService**
   👉 提供显式、可控的 Redis 读写能力（支持压缩）
2. **RedisPlusInterceptor**
   👉 提供 HTTP API 级别的透明缓存拦截能力

---

## 📐 设计目标

* 提高 API 响应速度，减少重复计算
* 减少对第三方平台（链上 / 链下 API）的访问压力
* 支持大 JSON 数据的高效存储
* 保持行为可预测，避免“隐式缓存魔法”

---

## 🧱 模块结构

```
src/redis/
├─ redis.service.ts                 # Redis 核心缓存服务
├─ interceptors/
│  └─ redis.plus-interceptor.ts     # HTTP 缓存拦截器
├─ redis.constants.ts               # 缓存相关元数据定义
```

---

## 🧩 RedisCacheService

`RedisCacheService` 是一个 **底层、显式、面向性能的 Redis 缓存服务**，用于后端内部模块直接调用。

### 核心能力概览

✅ 单 key / 多 key 读写
✅ JSON 字符串存储
✅ GZIP 压缩 / 非压缩双路径
✅ TTL 抖动，防止缓存雪崩
✅ 安全 JSON.parse，避免脏数据导致进程崩溃

---

### 1️⃣ 单 Key 读 / 写（非压缩）

```ts
getKey<T>(key)
setKey<T>(key, value, ttlSec)
delKey(key)
```

**特点**

* 数据以 JSON 字符串形式存储
* value 为 `null / undefined` 时跳过写入并记录日志
* 使用安全 JSON.parse，失败返回 `null`

**适用场景**

* 小体量结构化数据
* 配置、状态、排行榜摘要等

---

### 2️⃣ 批量 Key 读 / 写（非压缩）

```ts
mGetKeys<T>(keys[])
mSetKeys([{ key, value, ttlSec }])
mDelKeys(keys[])
```

**特点**

* 读取顺序与 keys 顺序严格一致
* 写入为逐 key SET，避免大批量失败
* 非法 value 自动跳过

**适用场景**

* 榜单列表
* 多 Token 状态聚合
* 分页缓存数据

---

### 3️⃣ 单 Key 读 / 写（GZIP 压缩）

```ts
getKeyGz<T>(key)
setKeyGz<T>(key, value, ttlSec)
```

**实现要点**

* 使用 GZIP（Z_BEST_SPEED）压缩 JSON
* Redis 以二进制 Buffer 存储
* 自动 TTL 抖动（默认 ±5%）
* 解压后再安全解析

**适用场景**

* 超大 JSON
* Solscan / Moralis 的交易详情
* 链上明细类数据

---

### 4️⃣ 批量 Key 读 / 写（GZIP 压缩）

```ts
mGetKeysGz<T>(keys[])
mSetKeysGz([{ key, value, ttlSec }])
```

**特点**

* 使用 `mgetBuffer` 避免字符串中转
* 顺序严格一致
* 针对大数据批量读取性能优化

---

### 5️⃣ 开发环境辅助能力

```ts
clearDev()
```

* 仅允许在 `NODE_ENV=development` 下执行
* 用于快速清空本地 Redis
* 生产环境必须通过 CLI 手动清理

---

### 设计原则（RedisCacheService）

* 不包含任何业务逻辑
* 不自动推断压缩策略（由调用方决定）
* 明确区分：压缩 / 非压缩
* 行为可预测、性能可控

---

## 🚦 RedisPlusInterceptor（HTTP 缓存拦截器）

`RedisPlusInterceptor` 提供 **API 级别的透明缓存能力**，用于缓存 HTTP GET 接口的完整响应结果。

---

### 工作流程

1. 根据请求生成缓存 key
2. 查询 Redis 是否命中
3. 命中则直接返回缓存结果
4. 未命中则执行 Controller 逻辑
5. 请求结束后将结果写入 Redis

---

### 支持范围

* **HTTP Method**：仅 `GET`
* **缓存粒度**：API Response
* **序列化方式**：JSON
* **存储后端**：Redis（ioredis）

---

### 缓存 Key 规则（支持 Query 参数）

缓存 key 由以下部分组成：

```
METHOD:URL?sorted_query_params
```

例如：

```
GET:/api/tokens?keyword=abc&minFdv=100
```

Query 参数会 **按字母排序**，确保：

```
?a=1&b=2 === ?b=2&a=1
```

避免由于参数顺序不同导致缓存失效。

---

### Cache Hit / Miss 行为

* **命中缓存**

  * 直接返回 Redis 中的数据
  * Controller 不会被执行
  * Response Header：

    ```
    X-Cache: HIT
    ```

* **未命中缓存**

  * 正常执行业务逻辑
  * 响应结束后写入 Redis
  * Response Header：

    ```
    X-Cache: MISS
    ```

---

### TTL 解析顺序

TTL 来自以下元数据（按优先级）：

1. 方法级 `@CacheTTL`
2. 类级 `@CacheTTL`
3. 未设置则为永久缓存

TTL 也支持 **函数形式**，可根据请求动态计算。

---

### 安全与容错

* `StreamableFile` 类型响应不会被缓存
* Redis 异常时自动降级，不影响接口可用性
* JSON 序列化失败仅记录日志，不中断请求

---

### 设计原则（Interceptor）

* 不做缓存失效管理
* 不做自动刷新
* 不引入压缩逻辑
* 专注于“拦截 + 返回”

---

## 🧠 使用建议

| 场景        | 推荐方式                 |
| --------- | -------------------- |
| 高频 GET 接口 | RedisPlusInterceptor |
| 复杂业务缓存    | RedisCacheService    |
| 超大 JSON   | GZIP 接口              |
| 榜单 / 聚合数据 | 批量接口                 |
| 精细缓存控制    | 手动 RedisCacheService |

---

## 📌 总结

该 Redis Layer 采用 **“显式缓存 + 拦截缓存并存”** 的设计：

* Interceptor：解决 **80% API 响应缓存**
* Service：解决 **20% 高复杂度 / 高性能场景**

在保证性能的同时，最大限度降低了系统复杂度与认知成本。

---