# src/api 模块说明（外部 API 接入与统一数据出口）

`src/api` 是整个系统中的 **外部数据接入层 + 统一数据生产出口层**，
负责将多个第三方 Web3 数据平台的数据进行 **平台隔离、风险解耦、结构统一**，
最终输出 **可直接被 task（定时任务）与 sort（排序评分）模块使用的标准化数据结构**。

> 该目录 **不负责定时调度**，也 **不直接参与排序或评分算法**，
> 核心目标只有一个：
>
> **把“杂乱、不稳定、差异巨大的第三方 API 数据”，转化为“稳定、统一、可缓存的系统数据事实”。**

---

## 一、目录结构总览

```text
src/api
├── platform-data/        # 行情 / 交易 / 基础数据平台（原始能力）
│   ├── api-cg/           # GeckoTerminal
│   ├── api-mo/           # Moralis
│   └── api-sol/          # Solscan
│
├── platform-safe/        # 安全 / 风险判定平台
│   └── api-gp/           # GoPlusLabs
│
└── uniform-data/         # 统一数据出口（系统唯一对外数据语义）
    └── api-gr/           # Global Result / General Result
```

---

## 二、platform-data（平台原始数据接入层）

> **原则：尽量保持平台原始语义，不引入业务判断**

该层的职责是：

* 对接第三方平台 API
* 屏蔽平台鉴权、限流、分页等细节
* 为上层提供“可控、可替换”的平台数据入口

每个平台模块内部均采用 NestJS 标准结构：

```text
api-xx.controller.ts
api-xx.module.ts
api-xx.service.ts
```

---

### 1️⃣ api-cg（GeckoTerminal · 行情 / Pool 数据源）

* 数据类型：

  * Trending Pools
  * New Pools
  * Pool 基础信息
  * Token 所在池子行情
* 支持链：

  * Solana
  * EVM 系列

#### 设计要点

* 使用 **独立 AxiosClient**，不污染 NestJS DI
* 免费版 API，不强制依赖 Pro Key
* 内部做分页与去重：

  * 以 `base_token.id` 为唯一 Token 标识
  * 避免同一 Token 多 Pool 重复

> api-cg 决定了：**“有哪些 Token 进入系统视野”**

---

### 2️⃣ api-mo（Moralis · EVM / Sol 通用数据源）

* 数据类型：

  * Token Metadata
  * Pair / Swap / Sniper
  * Holder / Holder Insights
  * OHLCV / K-line
* 支持链：

  * EVM（eth / bsc / base / arb …）
  * Solana

#### 设计要点

* 按链类型自动切换 Endpoint
* API Key 统一由 AxiosClient Header 管理
* 链名 → Moralis ChainId 映射统一处理

> api-mo 是 **跨链通用能力的主要来源**

---

### 3️⃣ api-sol（Solscan · Solana 深度数据补充）

api-sol 负责 **Solana 链的深度数据补充**，
是 Solana Token / Account / Pool 的事实来源之一。

#### 核心职责

* Token Metadata（单个 / 批量）
* Token Price（实时，不缓存）
* Holders / Transfers / DeFi 行为
* Account Portfolio / Token Accounts
* Pool / Market 列表与成交量

#### 关键设计原则

* **Metadata 可缓存，价格必须实时**
* API 批量能力受限时，统一做拆批处理
* 使用 Map 聚合结果，避免顺序依赖

> api-sol 是 Solana 链侧的数据“兜底与补全模块”

---

## 三、platform-safe（安全 / 风险判定层）

### api-gp（GoPlusLabs · Token 安全事实）

api-gp 模块用于接入 **GoPlusLabs**，
为系统提供 Token 合约级别的 **安全与风险判定数据**。

#### 核心定位

* 只提供 **安全事实**
* 不参与行情、不参与排序、不参与评分

#### 支持能力

* Honeypot
* Rug 风险
* 权限 / 黑名单 / 风险标记
* 支持 Solana + EVM

#### 重要现实约束

* GoPlus API 虽支持多地址参数
* **实际只返回第一个地址的数据**
* 因此系统内部采用：

  * **单 Token 查询模型**
  * Map 方式聚合结果

> api-gp 的存在，是为了让后续排序与评分
> **有“可解释、可追溯的风险依据”**

---

## 四、uniform-data（统一数据出口层）

### api-gr（Global Result / 系统最终数据出口）

`api-gr` 是整个 `src/api` 的 **最终聚合层**，
也是 **task / sort 模块唯一应该直接调用的 API Service**。

它不是简单“拼接口”，而是一条 **完整的数据生产流水线**。

---

## 五、api-gr 的四段式数据处理流程

### 第一段：Pool → Token 初始列表

* 数据源：GeckoTerminal
* 功能：

  * Trending / New Pools
  * 分页控制（Sol / EVM 分离）
* 输出：

  * `ICgPoolItem[]` → `IGrTokenSortItem_Client[]`

> 决定“哪些 Token 值得继续处理”

---

### 第二段：TokenSecurity（风险事实注入）

处理流程：

1. 优先从 Redis 读取 TokenSecurity
2. 未命中 → 调用 GoPlus API
3. 根据 Token 创建时间动态计算 TTL
4. 写回 Redis
5. 合并进 Token 统一结构

> 风险数据是 **事实型数据**，允许缓存，但必须可更新

---

### 第三段：Token Metadata（基础属性补全）

* Redis + API 双通道策略
* Solana → Solscan
* EVM → Moralis
* 批量参数、分隔符、BatchSize 全部常量化

最终：

* 写回 Redis
* 合并进 `IGrTokenSortItem_Client`

---

### （预留）第四段：链上行为识别（Sol 专用）

* 基于 Solscan 的交易与行为数据
* 用于 Pump / Bonk 等发射行为识别
* 不影响前三段稳定性

---

## 六、工程设计总结

### Axios 设计

* 每个平台 **独立 AxiosClient**
* 不共享 baseURL / headers
* 不依赖 Nest HttpModule

### Redis 使用原则

* 只缓存：

  * TokenSecurity
  * TokenMetadata
* 不缓存价格、不缓存短期波动

### api-gr 的真实角色

> **api-gr = 系统的数据生产出口**

它负责：

* 控制 API 调用频率
* 控制缓存策略
* 控制数据可信度
* 输出统一、稳定、可直接使用的数据结构

最终产出：

```ts
IGrTokenSortItem_Client[]
```

可直接送入：

* sort（排序）
* score（评分）
* rank（榜单）

---

## 七、一句话总结

> **platform-data 提供“原材料”**
> **platform-safe 提供“风险事实”**
> **uniform-data 把它们变成“可以直接用的数据”**
