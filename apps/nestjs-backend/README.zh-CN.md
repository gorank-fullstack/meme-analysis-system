## 目录

1. [NestJS 项目介绍](#intro)
2. [技术栈](#technology)
3. [核心功能](#function)
4. [后端任务流水线](#pipeline)
5. [Token 评分模块](#scoring)
6. [仓库结构](#structure)
7. [申请 API Key](#apikey)
8. [修改 .env 文件名](#envname)
9. [配置 .env 环境变量](#envset)
10. [Redis 安装](#redis)
11. [启动项目](#start)

---
## ⚠️ 运行前提示

本项目需要 **Redis** 和多个第三方 **API Key** 才能运行。

运行项目前，需要先完成：

- 第七部分：申请第三方 API Key
- 第八部分：修改 .env 文件名
- 第九部分：配置 .env 环境变量
- 第十部分：Redis 的安装与配置

完成以上步骤后，再执行：

> 第十一部分：启动项目（Quick Start）

---

<a id="intro"></a>
## 第一部分：NestJS 项目介绍

关键词：**Monorepo · 全栈 · Web3 · 实时分析 · Token API**

本项目为 Web3 Token 实时分析系统的后端服务，
负责多源链上数据聚合、标准化处理与评分计算，
并基于 Redis 构建高性能排行榜 API，供 Next.js 前端调用。

### 已实现的功能

  * 多个第三方平台的数据抓取与合并
  * 支持：5m / 1h / 6h / 24h 时间范围的：热门、新币排行与分页
  * 检测：合约与池子风险
  * Redis 缓存：按 Token 上线时间、市值、交易额，生成动态过期时间

> ⚠️ 开源版本不包含核心排名算法

### 可扩展方向

  * 媒体监控（新闻、社交媒体）
  * 聪明钱监控（高收益地址分析）
  * KOL 交易监控

---

<a id="technology"></a>
## 第二部分：技术栈

| 层级      | 技术                          | 说明                           |
| ------- | --------------------------- | ---------------------------- |
| 开发语言    | **TypeScript**              | 前后端统一强类型                     |
| 框架      | **NestJS**                  | 模块化服务结构、API 编排、定时任务          |
| 数据抓取    | **Axios / HTTP**            | 多平台 API 调用                   |
| 缓存      | **Redis**                   | 高频数据缓存、排行榜、分页、TTL 管理         |
| 定时任务    | **NestJS Cron / 自定义任务**     | 多平台定时抓取、异步任务处理               |
| 接口与类型约束 | 自定义 Interface 模块 | 多链类型定义与接口结构 |
| 工具函数       | Math Utils            | 数值处理与精度控制     |

---

<a id="function"></a>
## 第三部分：核心功能

### 1. 数据采集与聚合

* 定时任务抓取以下平台 API 数据：

  * **GeckoTerminal**
  * **Moralis**
  * **Solscan**
  * **GoPlusLabs**

* 抓取的数据类型包括：

  * Token 上线时间、价格、交易量、流通市值
  * 热门交易排序
  * 持币地址数量
  * 相关媒体信息
  * 合约风险检测
  * 池子安全评估

* 数据类型和结构由 `interface` 目录定义，保证前后端一致性。

---

### 2. 数据处理与排序

* **sort-hot**：热门交易 Token 排序
* **sort-new**：新上币 Token 排序
* **uniform-data**：统一数据处理，跨平台抽象

* 支持前端 API 调用获取排行榜和 Token 详情

---

### 3. Redis 缓存策略

* 根据 **Token 上线时间**智能设置缓存 TTL：

  * 上线越久 → 缓存越长
  * TTL 范围：5 分钟 — 72 小时

* Redis 用途：

  * 排行榜缓存
  * 热门 Token 列表缓存
  * 分页查询结果缓存
  * 计算型非持久数据

> Redis 仅用于减少重复计算和 I/O；
> 后续实现：用户信息、邀请关系、交易、统计盈亏等，将使用：PostgreSQL

---

### 4. 任务调度系统

* 位于 `task/uniform-data/`
* 定时抓取各平台数据
* 自动更新 Redis 缓存
* 支持多线程异步抓取
* 支持错误重试和日志记录

---

### 5. 前后端契约与接口类型

* `interface/interface-base/chain_type.ts`：链类型定义

  ```ts
  export type TChainName = "sol" | "eth" | "bsc" | ...;
  export type TChainEvm = "eth" | "bsc" | ...;
  export type TChainQtKey = `${TChainName}_${TQtType}`;
  ```

* `interface/interface-base/platform-types.ts`：平台类型、ProgramId、SOL_PUMP / SOL_BONK 相关常量

* `interface/interface-utils/math.ts`：数字处理函数，含：

  * 四舍五入 / 向下取整
  * 百分比转换
  * 市值换算为百万单位，最小值 0.01
  * 字符串安全转数字

* 前后端共享接口保证类型安全，方便扩展和维护

---

### 6. Web3 链上支持

* `web3/` 模块负责链上数据抓取
* 支持 SPL、EVM、TVM、FVM、TAO、Move 等多链生态
* 提供 Token 池子信息、交易历史和流动性分析
* 结合接口类型，保证前后端数据一致性

---

### 7. 工程特性

* 核心抓取、排序模块可运行生产
* Redis 缓存策略优化，TTL 自动计算
* 模块化结构，便于扩展和维护
* 接口层和工具函数统一，保证类型安全和数据精度
* 日志记录、错误重试、异步抓取，工程实践完善

---

<a id="pipeline"></a>
## 第四部分：后端任务流水线（Backend Task Pipeline）

后端采用基于任务驱动的流水线机制，对 Token 数据进行获取、处理与缓存：

> 该流水线采用“定时任务驱动的预计算 + Redis 缓存”架构，
> 通过定时任务周期性拉取热度榜 / 新币榜数据，并完成评分计算与缓存写入，
> API 请求阶段仅从 Redis 读取结果，不触发实时计算，
> 从而避免高并发场景下的性能开销。

```text
[定时任务（Task Scheduler / Cron Jobs）]
        ↓
[拉取热度榜 / 新币池数据（第三方 API）]
        ↓
[初始化 Token 数据]
        ↓
[数据清洗与标准化处理]
        ↓
[Token 评分引擎]
        ↓
[写入 Redis 缓存]
        ↓
[提供 API 给前端]
```

## 关键设计说明（Key Design Notes）

- **多源数据获取**
  - 聚合多个第三方 API 数据，避免单一数据源缺失

- **数据标准化处理**
  - 统一不同来源的数据结构，保证后续处理一致性

- **评分引擎（核心）**
  - 对 Token 进行综合评分与排序（当前版本未开源）

- **缓存优化（Redis）**
  - 采用预计算 + 缓存策略，避免高频重复计算

- **任务驱动架构**
  - 通过定时任务周期性构建数据 pipeline，
    在任务执行阶段完成数据计算与缓存写入，
    将计算与请求解耦

---

<a id="scoring"></a>
## 第五部分：Token 评分模块

Token 评分模块（Token Scoring Engine）属于系统核心业务逻辑层（Domain Layer），
负责对链上 Token 进行多维度评估，生成综合评分（Token Score），
驱动排行榜与风险识别能力。

评分系统基于多源链上数据指标，
通过 **200+ 条评分规则** 进行综合分析，
用于识别 Token 活跃度、风险行为及异常市场结构。

---

### 1. Token 评分规则与计算公式说明

Token 综合评分基于 **多维度评分模型（Multi-Factor Scoring Model）** 生成。

评分系统会对以下情况进行 **风险降权或过滤处理**：

* 异常交易行为
* 高风险合约
* 可疑交易结构
* 极端价格波动

通过这些机制，系统可以提升排行榜数据的 **有效性与可靠性**。

由于评分算法属于系统核心逻辑，
**完整评分规则与计算公式未在 GitHub 版本中公开。**

### 2. GitHub 版本代码说明

为保证项目可以正常运行并展示系统整体架构，
仓库中保留了 **移除评分规则与计算公式后的演示版本代码**，
用于展示评分模块的调用流程与系统结构。

演示版本代码文件统一以 `_github.ts` 结尾。

#### 代码文件 1

```text
原始代码（未公开）
apps/nestjs-backend/src/utils/sort/uniform-data/sort-hot_rank.ts

GitHub 版本（移除计算公式）
apps/nestjs-backend/src/utils/sort/uniform-data/sort-hot_rank_github.ts
```

#### 代码文件 2

```text
原始代码（未公开）
apps/nestjs-backend/src/utils/sort/uniform-data/sort-hot_rule.ts

GitHub 版本（移除评分规则）
apps/nestjs-backend/src/utils/sort/uniform-data/sort-hot_rule_github.ts
```

### 3. Token 评分数据维度

评分系统会综合以下链上数据指标进行评估：

#### 生命周期指标
- Token 上线时间
- 流通市值

#### 交易行为指标
- 分时段换手率
- 独立交易地址数量

#### 持仓结构指标
- Top10 持仓占比
- Top100 持仓占比

#### 价格行为指标
- 分时段价格涨跌幅

#### 交易税率指标
- 交易税率
- 转账税率

#### 市值指标
- 开盘市值
- 当前流通市值

#### 安全指标
- 合约安全评分


### 4. Token 刷新与超时移除机制

系统在每次调用第三方平台的 **热度排行榜 API** 与 **新币排行榜 API** 时，
会使用最新获取的 Token 数据更新本地 Token 信息，
并重新计算 Token 评分及排行榜排序。

对于在连续多次数据更新中 **未再次命中的 Token**，
系统会将其视为失活 Token，并从排行榜数据中移除，
以保证排行榜数据的实时性与有效性。

---

<a id="structure"></a>
## 第六部分：仓库结构

### 一、仓库结构总览

项目采用“数据抓取 → 统一数据处理 → 排序计算 → API 输出”的分层架构。

```text
nestjs-backend/
├─ src/
│  ├─ api/
│  │  ├─ platform-data/   # GeckoTerminal、Moralis、Solscan、GoPlusLabs 数据抓取
│  │  ├─ platform-safe/   # 合约 / 池子安全性检测
│  │  └─ uniform-data/    # 跨平台统一数据处理
│  │
│  ├─ redis/              # Redis 配置、服务、装饰器
│  │
│  ├─ sort/
│  │  ├─ uniform-data/    # 排序数据处理逻辑
│  │  ├─ sort-hot/        # 热门 Token 排序
│  │  └─ sort-new/        # 新上币 Token 排序
│  │
│  ├─ task/               # 定时任务管理
│  │  └─ uniform-data/    # 各类任务处理逻辑
│  │
│  ├─ time/               # 时间相关工具函数
│  ├─ utils/              # 公共工具函数
│  ├─ web3/               # 是否伪造：pump、bonk 发币检测
│  │
│  ├─ app.module.ts
│  └─ main.ts
│
└─ package.json

```

---
### 二、分层 README 导航

以下目录包含各模块的说明文档（README 文件）：

```text
nestjs-backend/
├─ README.md              # 后端整体架构说明（NestJS 分层说明）
│
├─ src/
│  ├─ api/                # 平台数据抓取与统一数据处理
│  │   └─ README.md
│  │
│  ├─ redis/              # Redis 配置与缓存逻辑
│  │   └─ README.md
│  │
│  ├─ sort/               # Token 排序算法模块
│  │   └─ README.md
│  │
│  ├─ task/               # 定时任务与数据抓取任务
│  │   └─ README.md
│  │
│  └─ utils/              # 公共工具函数
│      └─ README.md

```
---

<a id="apikey"></a>
## 第七部分：申请第三方 API Key

### 1. Solscan

[Solscan API](https://solscan.io/apis)

* **必须使用 Solscan Pro API（Level 2 及以上）** 才能访问所需接口
* ⚠️ 若未申请付费版 Solscan API：

  * 项目 **仍然可以运行，但部分 Solana 数据将无法获取**

---

### 2. Moralis

[Moralis API](https://moralis.com/api/)

* 测试 / 本地调试：**免费版 API 即可**
* 个人长期运行：建议使用 **Starter 会员（$49 / 月）起**

---

### 3. GeckoTerminal

[GeckoTerminal API](https://www.geckoterminal.com/dex-api?utm_source=gt-apiguide&utm_medium=referral&utm_content=apiguide-swagger)

* 免费版 API 限制：**10 次 / 分钟**
* 个人运行：建议使用 **Basic 会员（$29 / 月）起**
* 注：GeckoTerminal 为 **CoinGecko 旗下链上数据平台**

---

### 4. GoPlus

[GoPlus API](https://gopluslabs.io/)

* 测试或个人运行：**免费版 API 已足够使用**
* 付费 API 为可选项

---

<a id="envname"></a>
## 第八部分：修改 .env 文件名

修改以下 .env 文件名：

---

**开发环境**

```text
apps/nestjs-backend/.env copy.development
→ apps/nestjs-backend/.env.development
```

**生产环境**

```text
apps/nestjs-backend/.env copy.production
→ apps/nestjs-backend/.env.production
```

---

<a id="envset"></a>
## 第九部分：配置 .env 环境变量

> 注：本项目涉及以下工具：
>
> - Next.js
> - NestJS
> - Redis
> - 本地缓存文件
> - （后续扩展）PostgreSQL

所有工具 **严格区分开发 / 生产模式**，
不同模式下的数据与本地缓存 **完全独立、互不干扰**。

---

```text
apps/nestjs-backend/.env.development   # 开发模式
apps/nestjs-backend/.env.production    # 生产模式
```

1.1 Redis 相关配置

* `REDIS_HOST`：Redis 主机地址
* `REDIS_PORT`：Redis 端口号
* `REDIS_PASSWORD`：Redis 连接密码

> 注：
> 若开发 / 生产环境使用 **同一 Redis 主机**，
> 建议通过 **端口号区分实例**。

1.2 文件与日志路径

* `LOG_FILE_PATH`
  * 日志目录（**每天凌晨持久化一次**）

* `MAP_FILE_PATH`
  * Map 备份目录（**每 2 小时保存一次**）
  * 用于 Redis 异常时的 **保守备份机制**

1.3 第三方平台 API Key

* `API_MO_KEY`：moralis.com
* `API_SOL_KEY`：solscan.io
* `API_CG_KEY`：geckoterminal.com

1.4 Solana RPC 配置

* `SOL_RPC_URL`：Solana RPC 地址（可使用默认）

该 RPC **仅用于**：
* 假冒 **pump / bonk 发射识别**

引用目录：

```text
apps/nestjs-backend/src/web3/block-conn/sol-conn
```

说明：

* 使用 **免费 RPC** 时：
  * 单次仅能查询 **一个合约**

* 替代方案：
  * 使用 **Solscan 付费 API**
  * 支持 **批量查询**

相关实现代码：

```text
apps/nestjs-backend/src/utils/api/platform-data/api-sol_trans.ts
```

核心方法：

* `isPumpLaunch`
* `isBonkLaunch`

---

<a id="redis"></a>
## 第十部分：Redis 的安装与配置

**（示例：Windows 系统，Linux / 服务器环境请自行调整）**

### 一、Redis 安装

````md
> 注：  
> - Windows 示例中使用 **Redis 5.0.x** 即可正常运行  
> - Linux / 服务器环境建议 **Redis ≥ 6.0（推荐 7.x）**

- 安装包示例：`Redis-x64-5.0.14.1.msi`
- 下载地址：  
  https://github.com/tporadowski/redis/releases

假设 Redis 安装目录为：

D:/Redis/
````

### 二、Redis 配置文件


#### （一）目录结构

在 `D:/Redis/` 下创建如下目录与文件：

```text
D:/Redis/
├─ dev/
│  ├─ redis_dev.conf
│  ├─ data/
│  └─ logs/
└─ pro/
   ├─ redis_pro.conf
   ├─ data/
   └─ logs/
```

---

#### （二）开发环境配置

`D:/Redis/dev/redis_dev.conf`

```conf
# ===== 基础 =====
bind 127.0.0.1
protected-mode yes
port 27864

# ===== 数据与进程 =====
dir D:/Redis/dev/data
pidfile D:/Redis/dev/redis_27864.pid

# ===== 持久化（dev 可开）=====
appendonly yes
appendfilename "appendonly.aof"
dbfilename dump.rdb

# ===== 日志 =====
logfile "D:/Redis/dev/logs/redis_27864.log"

# ===== 内存策略（dev 建议）=====
maxmemory 1024mb
maxmemory-policy allkeys-lru

# ===== 安全 =====
requirepass "dev#@.2025"
```

---

#### （三）生产环境配置

`D:/Redis/pro/redis_pro.conf`

```conf
# ===== 基础 =====
bind 127.0.0.1
protected-mode yes
port 31964

# ===== 数据与进程 =====
dir D:/Redis/pro/data
pidfile D:/Redis/pro/redis_31964.pid

# ===== 持久化（pro 建议开）=====
appendonly yes
appendfilename "appendonly.aof"
dbfilename dump.rdb

# ===== 日志 =====
logfile "D:/Redis/pro/logs/redis_31964.log"

# ===== 内存策略（pro 推荐）=====
maxmemory 4096mb
maxmemory-policy volatile-lru

# ===== 安全 =====
requirepass "pro&9.%!2"
```

---

### 三、运行 Redis

进入 Redis 安装目录：

```bash
cd D:/Redis
```

#### 开发模式

```bash
./redis-server.exe D:/Redis/dev/redis_dev.conf
```

检查是否正常启动：

```bash
netstat -ano | findstr 27864
```

#### 生产模式

```bash
./redis-server.exe D:/Redis/pro/redis_pro.conf
```

检查是否正常启动：

```bash
netstat -ano | findstr 31964
```
---

<a id="start"></a>
## 第十一部分：启动项目（Quick Start）

### 一：前置检查工作

注：本项目为 Monorepo 结构。
如未初始化：Monorepo 根项目，请先在仓库根目录安装依赖

```bash
pnpm install
```

### 二：进入后端目录：

```bash
cd apps/nestjs-backend
```

### 三：运行 NestJS 后端项目

**开发模式**

```bash
pnpm run start:dev
```

**生产模式（编译 → 运行）**

```bash
pnpm run build
pnpm run start:prod
```

### 四：Windows + VPN 网络环境说明（重要）

在 Windows 本机（127.0.0.1）开启 VPN 后，
若出现 **NestJS 无法访问远程 API** 的情况，
可为 Node.js 设置 **进程级全局代理**。

在执行 `pnpm run start:dev` 或 `pnpm run start:prod` **之前**，
先执行（PowerShell）：

```powershell
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"
```

然后再启动项目：

```bash
pnpm run start:dev
# 或
pnpm run start:prod
```

> ⚠️ 说明：
> 该方式为 **Node.js 进程级全局代理**，
> **仅建议用于本地开发 / 调试环境**，
> 不推荐在服务器生产环境长期使用。

---
## 联系方式

如果您有任何问题、建议或合作想法：

- GitHub: https://github.com/gorank-fullstack
- Telegram: t.me/gorank_fullstack
- Email: gorank1024@gmail.com

---