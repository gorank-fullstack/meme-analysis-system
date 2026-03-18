---

# src/api Module Overview

*(External API Integration & Unified Data Output)*

`src/api` serves as the system’s **external data access layer + unified data production output layer**.
It is responsible for **isolating platforms, decoupling risks, and normalizing structures** across multiple third-party Web3 data providers, and finally producing **standardized data structures that can be directly consumed by the `task` (scheduled jobs) and `sort` (ranking & scoring) modules**.

> This directory **does not handle scheduling**, and **does not directly participate in ranking or scoring algorithms**.
> It has one core goal:
>
> **Transform “messy, unstable, highly divergent third-party API data” into “stable, unified, cacheable system-level data facts.”**

---

## 1. Directory Structure Overview

```text
src/api
├── platform-data/        # Market / trading / basic data platforms (raw capabilities)
│   ├── api-cg/           # GeckoTerminal
│   ├── api-mo/           # Moralis
│   └── api-sol/          # Solscan
│
├── platform-safe/        # Security / risk assessment platforms
│   └── api-gp/           # GoPlusLabs
│
└── uniform-data/         # Unified data output (the system’s single external data semantics)
    └── api-gr/           # Global Result / General Result
```

---

## 2. platform-data (Raw Platform Data Access Layer)

> **Principle: Preserve platform-native semantics as much as possible, and avoid introducing business judgment.**

Responsibilities of this layer:

* Integrate with third-party platform APIs
* Abstract away authentication, rate limiting, pagination, and platform-specific details
* Provide **controllable and replaceable** platform-level data entry points for upper layers

Each platform module follows the standard NestJS structure:

```text
api-xx.controller.ts
api-xx.module.ts
api-xx.service.ts
```

---

### 1️⃣ api-cg (GeckoTerminal · Market & Pool Data Source)

* **Data types:**

  * Trending Pools
  * New Pools
  * Pool basic information
  * Pool-level token market data
* **Supported chains:**

  * Solana
  * EVM family

#### Design Highlights

* Uses an **independent Axios client**, without polluting NestJS DI
* Uses free-tier APIs; no mandatory Pro key dependency
* Internal pagination and deduplication:

  * Uses `base_token.id` as the unique Token identifier
  * Avoids duplicate Tokens appearing across multiple pools

> `api-cg` determines **“which Tokens enter the system’s field of view.”**

---

### 2️⃣ api-mo (Moralis · Cross-chain General Data Source)

* **Data types:**

  * Token metadata
  * Pair / swap / sniper data
  * Holder / holder insights
  * OHLCV / K-line data
* **Supported chains:**

  * EVM (eth / bsc / base / arb …)
  * Solana

#### Design Highlights

* Automatically switches endpoints based on chain type
* API keys are centrally managed via Axios client headers
* Unified mapping from internal chain names → Moralis Chain IDs

> `api-mo` is the **primary source of cross-chain common capabilities**.

---

### 3️⃣ api-sol (Solscan · Deep Solana Data Supplement)

`api-sol` is responsible for **deep data supplementation on the Solana chain**,
and acts as one of the authoritative data sources for Solana Tokens / Accounts / Pools.

#### Core Responsibilities

* Token metadata (single / batch)
* Token price (real-time, non-cacheable)
* Holders / transfers / DeFi activities
* Account portfolio / token accounts
* Pool / market lists and volume statistics

#### Key Design Principles

* **Metadata is cacheable; prices must always be real-time**
* Batch size limitations are handled via internal request splitting
* Results are aggregated using Maps to avoid order dependency

> `api-sol` acts as the **fallback and completion module** for Solana-side data.

---

## 3. platform-safe (Security & Risk Assessment Layer)

### api-gp (GoPlusLabs · Token Security Facts)

The `api-gp` module integrates **GoPlusLabs** to provide **contract-level security and risk assessment data** for Tokens.

#### Core Positioning

* Provides **security facts only**
* Does not participate in market data, ranking, or scoring

#### Supported Capabilities

* Honeypot detection
* Rug-pull risk
* Privilege / blacklist / risk flags
* Supports both Solana and EVM chains

#### Important Practical Constraint

* Although the GoPlus API nominally supports multiple addresses per request,
* **it effectively returns data for only the first address**
* Therefore, the system adopts:

  * A **single-token query model**
  * Map-based result aggregation

> The existence of `api-gp` ensures that downstream ranking and scoring
> have **explainable and traceable risk evidence**.

---

## 4. uniform-data (Unified Data Output Layer)

### api-gr (Global Result / Final System Data Output)

`api-gr` is the **final aggregation layer** of `src/api`,
and the **only API service that `task` and `sort` modules should directly call**.

It is not a simple “API stitching layer”, but a **complete data production pipeline**.

---

## 5. The Four-Stage Data Processing Pipeline of api-gr

### Stage 1: Pool → Initial Token List

* **Data source:** GeckoTerminal
* **Functions:**

  * Trending / New Pools
  * Pagination control (Solana / EVM separated)
* **Output:**

  * `ICgPoolItem[]` → `IGrTokenSortItem_Client[]`

> Determines **“which Tokens are worth further processing.”**

---

### Stage 2: TokenSecurity (Risk Fact Injection)

Processing flow:

1. Attempt to read TokenSecurity from Redis
2. Cache miss → call GoPlus API
3. Dynamically calculate TTL based on Token creation time
4. Write back to Redis
5. Merge into the unified Token structure

> Risk data is **fact-based data**: cacheable, but must remain updateable.

---

### Stage 3: Token Metadata (Basic Attribute Completion)

* Dual-channel strategy: Redis + API
* Solana → Solscan
* EVM → Moralis
* Batch size, separators, and request limits are fully constant-defined

Final result:

* Written back to Redis
* Merged into `IGrTokenSortItem_Client`

---

### (Reserved) Stage 4: On-chain Behavior Recognition (Solana Only)

* Based on Solscan transaction and behavior data
* Used for launch-pattern recognition (e.g. Pump / Bonk-style launches)
* Does **not** affect the stability of the first three stages

---

## 6. Engineering Design Summary

### Axios Strategy

* Each platform uses an **independent Axios client**
* No shared baseURL or headers
* No dependency on NestJS HttpModule

### Redis Usage Principles

* Cached data only:

  * TokenSecurity
  * TokenMetadata
* Prices and short-term volatility data are never cached

### The Real Role of api-gr

> **api-gr = the system’s data production output**

It is responsible for:

* Controlling API call frequency
* Enforcing cache strategies
* Ensuring data credibility
* Producing unified, stable, directly consumable data structures

Final output:

```ts
IGrTokenSortItem_Client[]
```

Which can be directly fed into:

* `sort` (ranking)
* `score` (scoring)
* `rank` (leaderboards)

---

## 7. One-Sentence Summary

> **platform-data provides the “raw materials”**
> **platform-safe provides the “risk facts”**
> **uniform-data turns them into “data you can actually use.”**

---