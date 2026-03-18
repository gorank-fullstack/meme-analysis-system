
## Table of Contents

1. [NestJS Project Introduction](#intro)
2. [Technology Stack](#technology)
3. [Core Features](#function)
4. [Backend Task Pipeline](#pipeline)
5. [Token Scoring Module](#scoring)
6. [Repository Structure](#structure)
7. [Apply for API Keys](#apikey)
8. [Rename .env File](#envname)
9. [Configure .env Environment Variables](#envset)
10. [Redis Installation](#redis)
11. [Start the Project](#start)

---

## ⚠️ Pre-run Notice

This project requires **Redis** and multiple third-party **API Keys** to run.

Before starting the project, please complete:

* Part 7: Apply for third-party API Keys
* Part 8: Rename the `.env` file
* Part 9: Configure `.env` environment variables
* Part 10: Install and configure Redis

After completing the above steps, proceed to:

> Part 11: Start the Project (Quick Start)

---

## Part 1: NestJS Project Introduction

<a id="intro"></a>

Keywords: **Monorepo · Full-stack · Web3 · Real-time Analysis · Token API**

This project is the backend service of a Web3 Token real-time analytics system.
It is responsible for aggregating multi-source on-chain data, performing standardized processing and scoring calculations,
and building high-performance ranking APIs based on Redis for consumption by a Next.js frontend.

### Implemented Features

* Data fetching and aggregation from multiple third-party platforms
* Support for **5m / 1h / 6h / 24h** time ranges: trending tokens, new tokens, and pagination
* Contract and liquidity pool risk detection
* Redis caching with dynamic TTL based on token age, market cap, and trading volume

> ⚠️ The open-source version does NOT include the core ranking algorithm

### Extensibility

* Media monitoring (news, social platforms)
* Smart money tracking (high-profit wallet analysis)
* KOL trading monitoring

---

## Part 2: Technology Stack

<a id="technology"></a>

| Layer         | Technology                     | Description                                                  |
| ------------- | ------------------------------ | ------------------------------------------------------------ |
| Language      | **TypeScript**                 | Strong typing shared across frontend and backend             |
| Framework     | **NestJS**                     | Modular architecture, API orchestration, scheduled tasks     |
| Data Fetching | **Axios / HTTP**               | Multi-platform API integration                               |
| Cache         | **Redis**                      | High-frequency caching, rankings, pagination, TTL management |
| Scheduler     | **NestJS Cron / Custom Tasks** | Scheduled fetching and async processing                      |
| Interfaces    | Custom Interface Modules       | Multi-chain type definitions and API contracts               |
| Utilities     | Math Utils                     | Numeric processing and precision handling                    |

---

## Part 3: Core Features

<a id="function"></a>

### 1. Data Collection & Aggregation

* Scheduled tasks fetch data from:

  * **GeckoTerminal**
  * **Moralis**
  * **Solscan**
  * **GoPlusLabs**

* Data includes:

  * Token launch time, price, trading volume, circulating market cap
  * Trending rankings
  * Holder count
  * Media-related data
  * Contract risk analysis
  * Liquidity pool security evaluation

* Data structures are defined in the `interface` directory to ensure frontend-backend consistency.

---

### 2. Data Processing & Ranking

* **sort-hot**: Trending token ranking

* **sort-new**: Newly listed token ranking

* **uniform-data**: Cross-platform data normalization

* Provides APIs for frontend to fetch rankings and token details

---

### 3. Redis Caching Strategy

* TTL is dynamically calculated based on **token age**:

  * Older tokens → longer cache duration
  * TTL range: **5 minutes – 72 hours**

* Redis is used for:

  * Ranking cache
  * Trending token lists
  * Pagination results
  * Computed non-persistent data

> Redis is used only to reduce repeated computation and I/O
> Future features such as user data, referrals, trading, and PnL tracking will use **PostgreSQL**

---

### 4. Task Scheduling System

* Located in `task/uniform-data/`
* Periodically fetches data from platforms
* Automatically updates Redis cache
* Supports multi-threaded async fetching
* Includes retry mechanisms and logging

---

### 5. Frontend-Backend Contracts & Types

* `interface/interface-base/chain_type.ts`: Chain type definitions

```ts
export type TChainName = "sol" | "eth" | "bsc" | ...;
export type TChainEvm = "eth" | "bsc" | ...;
export type TChainQtKey = `${TChainName}_${TQtType}`;
```

* `interface/interface-base/platform-types.ts`: Platform types, ProgramId, SOL_PUMP / SOL_BONK constants

* `interface/interface-utils/math.ts`: Numeric utilities, including:

  * Rounding / flooring
  * Percentage conversion
  * Market cap conversion to millions (min value: 0.01)
  * Safe string-to-number conversion

* Shared interfaces ensure type safety and maintainability

---

### 6. Web3 Chain Support

* `web3/` module handles on-chain data fetching
* Supports multiple ecosystems: **SPL, EVM, TVM, FVM, TAO, Move**
* Provides token pool data, transaction history, and liquidity analysis
* Ensures consistent data structures via shared interfaces

---

### 7. Engineering Features

* Core fetching and ranking modules are production-ready
* Optimized Redis caching with auto TTL calculation
* Modular architecture for scalability and maintainability
* Unified interface and utility layers for type safety and precision
* Logging, retry mechanisms, and async processing implemented

---

## Part 4: Backend Task Pipeline

<a id="pipeline"></a>

The backend uses a task-driven pipeline to fetch, process, and cache token data:

> This pipeline adopts a **"scheduled pre-computation + Redis caching"** architecture.
> Scheduled tasks periodically fetch trending and new token data, perform scoring, and write results into Redis.
> During API requests, data is read directly from Redis without triggering real-time computation,
> thus avoiding performance overhead under high concurrency.

```text
[Task Scheduler / Cron Jobs]
        ↓
[Fetch Trending / New Token Data (Third-party APIs)]
        ↓
[Initialize Token Data]
        ↓
[Data Cleaning & Normalization]
        ↓
[Token Scoring Engine]
        ↓
[Write to Redis Cache]
        ↓
[Provide API to Frontend]
```

### Key Design Notes

* **Multi-source Data Aggregation**

  * Combines multiple APIs to avoid single-source dependency

* **Data Normalization**

  * Ensures consistent structure across different platforms

* **Scoring Engine (Core)**

  * Performs ranking and evaluation (not open-sourced)

* **Cache Optimization (Redis)**

  * Pre-computation + caching to avoid repeated calculations

* **Task-driven Architecture**

  * Decouples computation from request handling

---

## Part 5: Token Scoring Module

<a id="scoring"></a>

The Token Scoring Engine belongs to the **core domain layer** of the system.
It evaluates tokens across multiple dimensions and generates a **Token Score**,
which drives ranking and risk detection capabilities.

The scoring system is based on multi-source on-chain data
and uses **200+ scoring rules** to analyze token activity, risk, and abnormal market behavior.

---

### 1. Scoring Rules & Calculation Model

The token score is generated using a **multi-factor scoring model**.

The system applies **risk penalties or filtering** for:

* Abnormal trading behavior
* High-risk contracts
* Suspicious transaction patterns
* Extreme price volatility

These mechanisms improve the **accuracy and reliability** of ranking results.

> Due to its core importance,
> **the full scoring rules and formulas are not 공개 in the GitHub version.**

---

### 2. GitHub Version Code Explanation

To ensure the project remains runnable and demonstrates the full architecture,
the repository includes a **demo version with scoring logic removed**.

These demo files are suffixed with `_github.ts`.

#### File 1

```text
Original (Not Public)
apps/nestjs-backend/src/utils/sort/uniform-data/sort-hot_rank.ts

GitHub Version (Without formulas)
apps/nestjs-backend/src/utils/sort/uniform-data/sort-hot_rank_github.ts
```

#### File 2

```text
Original (Not Public)
apps/nestjs-backend/src/utils/sort/uniform-data/sort-hot_rule.ts

GitHub Version (Without rules)
apps/nestjs-backend/src/utils/sort/uniform-data/sort-hot_rule_github.ts
```

---

### 3. Token Scoring Data Dimensions

The scoring system evaluates:

#### Lifecycle Metrics

* Token launch time
* Circulating market cap

#### Trading Behavior Metrics

* Turnover rate over time
* Number of unique trading addresses

#### Holding Structure Metrics

* Top 10 holder ratio
* Top 100 holder ratio

#### Price Behavior Metrics

* Price change over time

#### Tax Metrics

* Trading tax
* Transfer tax

#### Market Cap Metrics

* Initial market cap
* Current circulating market cap

#### Security Metrics

* Contract security score

---

### 4. Token Refresh & Expiration Mechanism

Each time the system calls third-party **trending** and **new token APIs**,
it updates local token data with the latest information,
recalculates scores, and refreshes rankings.

If a token **fails to appear in multiple consecutive updates**,
it is considered inactive and removed from rankings,
ensuring real-time accuracy and relevance.

---

## Part 6: Repository Structure

<a id="structure"></a>

### 1. Overview

The project follows a layered architecture:

**Data Fetching → Unified Processing → Sorting → API Output**

```text
nestjs-backend/
├─ src/
│  ├─ api/
│  │  ├─ platform-data/   # GeckoTerminal, Moralis, Solscan, GoPlusLabs data fetching
│  │  ├─ platform-safe/   # Contract / liquidity pool security checks
│  │  └─ uniform-data/    # Cross-platform unified data processing
│  │
│  ├─ redis/              # Redis config, services, decorators
│  │
│  ├─ sort/
│  │  ├─ uniform-data/    # Sorting data processing logic
│  │  ├─ sort-hot/        # Trending token ranking
│  │  └─ sort-new/        # Newly listed token ranking
│  │
│  ├─ task/               # Scheduled task management
│  │  └─ uniform-data/    # Task processing logic
│  │
│  ├─ time/               # Time-related utility functions
│  ├─ utils/              # Common utility functions
│  ├─ web3/               # Pump / Bonk fake launch detection
│  │
│  ├─ app.module.ts
│  └─ main.ts
│
└─ package.json
```

---

### 2. Layered README Navigation

Each module includes its own documentation (README files):

```text
nestjs-backend/
├─ README.md              # Overall backend architecture (NestJS layering)
│
├─ src/
│  ├─ api/                # Platform data fetching & unified processing
│  │   └─ README.md
│  │
│  ├─ redis/              # Redis config & caching logic
│  │   └─ README.md
│  │
│  ├─ sort/               # Token ranking algorithms
│  │   └─ README.md
│  │
│  ├─ task/               # Scheduled tasks & data pipelines
│  │   └─ README.md
│  │
│  └─ utils/              # Common utilities
│      └─ README.md
```

---

## Part 7: Apply for Third-Party API Keys

<a id="apikey"></a>

### 1. Solscan

[https://solscan.io/apis](https://solscan.io/apis)

* **Solscan Pro API (Level 2 or higher)** is required to access necessary endpoints
* ⚠️ Without a paid API:

  * The project **can still run**, but some Solana data will be unavailable

---

### 2. Moralis

[https://moralis.com/api/](https://moralis.com/api/)

* For testing / local development: **Free API is sufficient**
* For long-term use: recommended **Starter plan ($49/month)**

---

### 3. GeckoTerminal

[https://www.geckoterminal.com/dex-api](https://www.geckoterminal.com/dex-api)

* Free tier limit: **10 requests/minute**
* Recommended: **Basic plan ($29/month)**
* Note: GeckoTerminal is a **CoinGecko-owned on-chain data platform**

---

### 4. GoPlus

[https://gopluslabs.io/](https://gopluslabs.io/)

* Free API is **sufficient for testing and personal use**
* Paid API is optional

---

## Part 8: Rename the `.env` File

<a id="envname"></a>

Rename the following files:

---

**Development**

```text
apps/nestjs-backend/.env copy.development
→ apps/nestjs-backend/.env.development
```

**Production**

```text
apps/nestjs-backend/.env copy.production
→ apps/nestjs-backend/.env.production
```

---

## Part 9: Configure `.env` Environment Variables

<a id="envset"></a>

> This project involves:
>
> * Next.js
> * NestJS
> * Redis
> * Local cache files
> * (Future) PostgreSQL

All tools strictly separate **development and production modes**,
with completely independent data and local caches.

---

```text
apps/nestjs-backend/.env.development   # Development mode
apps/nestjs-backend/.env.production    # Production mode
```

### 1. Redis Configuration

* `REDIS_HOST`: Redis host
* `REDIS_PORT`: Redis port
* `REDIS_PASSWORD`: Redis password

> Note:
> If dev and prod share the same Redis host,
> use **different ports** to distinguish instances.

---

### 2. File & Log Paths

* `LOG_FILE_PATH`

  * Log directory (**persisted daily at midnight**)

* `MAP_FILE_PATH`

  * Map backup directory (**saved every 2 hours**)
  * Acts as a fallback when Redis fails

---

### 3. Third-Party API Keys

* `API_MO_KEY`: moralis.com
* `API_SOL_KEY`: solscan.io
* `API_CG_KEY`: geckoterminal.com

---

### 4. Solana RPC Configuration

* `SOL_RPC_URL`: Solana RPC endpoint (default can be used)

This RPC is used **only for**:

* Detecting fake **pump / bonk launches**

Reference directory:

```text
apps/nestjs-backend/src/web3/block-conn/sol-conn
```

Notes:

* With **free RPC**:

  * Only **one contract per query**

* Alternative:

  * Use **Solscan paid API**
  * Supports **batch queries**

Implementation file:

```text
apps/nestjs-backend/src/utils/api/platform-data/api-sol_trans.ts
```

Core methods:

* `isPumpLaunch`
* `isBonkLaunch`

---

## Part 10: Redis Installation & Configuration

<a id="redis"></a>

**(Example: Windows environment. Adjust accordingly for Linux / servers)**

---

### 1. Install Redis

```md
> Notes:
> - Windows example uses Redis 5.0.x (sufficient)
> - Linux/server: Redis ≥ 6.0 (recommended 7.x)

- Example package: Redis-x64-5.0.14.1.msi
- Download:
  https://github.com/tporadowski/redis/releases

Assume installation path:

D:/Redis/
```

---

### 2. Redis Configuration Files

#### (1) Directory Structure

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

#### (2) Development Config

`D:/Redis/dev/redis_dev.conf`

```conf
# ===== Basic =====
bind 127.0.0.1
protected-mode yes
port 27864

# ===== Data & Process =====
dir D:/Redis/dev/data
pidfile D:/Redis/dev/redis_27864.pid

# ===== Persistence =====
appendonly yes
appendfilename "appendonly.aof"
dbfilename dump.rdb

# ===== Logs =====
logfile "D:/Redis/dev/logs/redis_27864.log"

# ===== Memory Policy =====
maxmemory 1024mb
maxmemory-policy allkeys-lru

# ===== Security =====
requirepass "dev#@.2025"
```

---

#### (3) Production Config

`D:/Redis/pro/redis_pro.conf`

```conf
# ===== Basic =====
bind 127.0.0.1
protected-mode yes
port 31964

# ===== Data & Process =====
dir D:/Redis/pro/data
pidfile D:/Redis/pro/redis_31964.pid

# ===== Persistence =====
appendonly yes
appendfilename "appendonly.aof"
dbfilename dump.rdb

# ===== Logs =====
logfile "D:/Redis/pro/logs/redis_31964.log"

# ===== Memory Policy =====
maxmemory 4096mb
maxmemory-policy volatile-lru

# ===== Security =====
requirepass "pro&9.%!2"
```

---

### 3. Run Redis

```bash
cd D:/Redis
```

#### Development

```bash
./redis-server.exe D:/Redis/dev/redis_dev.conf
```

Check:

```bash
netstat -ano | findstr 27864
```

#### Production

```bash
./redis-server.exe D:/Redis/pro/redis_pro.conf
```

Check:

```bash
netstat -ano | findstr 31964
```

---

## Part 11: Start the Project (Quick Start)

<a id="start"></a>

### 1. Prerequisites

This is a **monorepo project**.
If not initialized, install dependencies at root:

```bash
pnpm install
```

---

### 2. Enter Backend Directory

```bash
cd apps/nestjs-backend
```

---

### 3. Run NestJS Backend

**Development**

```bash
pnpm run start:dev
```

**Production**

```bash
pnpm run build
pnpm run start:prod
```

---

### 4. Windows + VPN Network Note (Important)

When using VPN on Windows (127.0.0.1),
if NestJS cannot access external APIs,
set a **global proxy for Node.js process**.

Before running:

```powershell
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"
```

Then start:

```bash
pnpm run start:dev
# or
pnpm run start:prod
```

> ⚠️ Note:
> This is a **process-level proxy** for Node.js.
> Recommended only for **local development**,
> not for long-term production use.

---

## Contact

If you have questions, suggestions, or collaboration ideas:

* GitHub: [https://github.com/gorank-fullstack](https://github.com/gorank-fullstack)
* Telegram: [t.me/gorank_fullstack](t.me/gorank_fullstack)
* Email: [gorank1024@gmail.com](mailto:gorank1024@gmail.com)

---
