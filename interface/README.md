<p align="left">
  Language
</p>

<p align="left">
  <strong>English</strong> | 
  <a href="./README.zh-CN.md">中文</a>
</p>

---

<p align="left">
  README Navigation
</p>

<p align="left">
  <a href="../README.md">root</a> &gt; <strong>interface</strong>
</p>

---

## 1.0 Interface Layer

This directory is used to define **data contracts, interface protocols, and shared type definitions** within the Meme Analysis System monorepo.

This layer acts as the system’s **Boundary Layer**, responsible for isolating and standardizing data interactions between the following modules:

1. External data sources (on-chain / off-chain third-party APIs)
2. Backend services (NestJS)
3. Frontend consumers (Next.js)

This directory does **not contain any business logic implementation**, and is only used to define:

1. TypeScript interfaces (`interface` / `type`)
2. Upstream API data structures
3. Unified data formats
4. Shared constants and utility types

---

## 2.0 Directory Structure

```text
interface/
├─ axios-client/            # Unified HTTP / Axios client wrapper
│
├─ interface-api/           # Third-party API interface definitions
│  ├─ platform-data/        # Market data / on-chain data platforms
│  ├─ platform-safe/        # Token security & risk detection platforms
│  └─ uniform-data/         # Unified data models + API output contract layer
│
├─ interface-base/          # Base type definitions (chain types, time windows, etc.)
│  ├─ chain_api.ts
│  ├─ chain_type.ts         # Chain types: SPL / EVM / TVM / FVM / TAO / Move
│  ├─ evm-address.ts        # Special EVM address definitions
│  ├─ gp-common-token-types.ts  # Tri-state (T3State): -1 (unknown) / 0 (no/safe) / 1 (yes/risk)
│  └─ platform-types.ts     # Platform types, default ProgramId, SOL_PUMP / SOL_BONK constants
│
├─ interface-task/          # Scheduled tasks & job-related interfaces
│  └─ uniform-data/
│
└─ interface-utils/         # Shared utility modules (math, sorting, time)
   ├─ common.ts
   ├─ math.ts               # Numeric processing, percentage conversion, rounding / floor
   ├─ sort.ts               # Sorting utilities
   └─ time.ts               # Time constants
```

---

## 3.0 axios-client

A shared HTTP access layer used by all backend modules to communicate with external APIs.

### 3.1 Responsibilities

1. Unified creation and configuration of Axios instances
2. Default timeout and headers management
3. Request and response interceptors
4. Centralized injection of authentication info (e.g., tokens)

### 3.2 Design Notes

1. Contains **no platform-specific logic**
2. Designed to be reused across multiple API modules

---

## 4.0 interface-api

Defines the **raw API data structures** of third-party platforms (Raw API Interfaces).

This layer strictly mirrors upstream API response formats, without unification or normalization. It is mainly used for:

1. Describing actual response fields
2. Serving as input for data transformation and scoring logic

---

### 4.1 platform-data

Interface definitions for market data and on-chain data platforms, currently including:

1. GeckoTerminal
2. Moralis
3. Solscan

#### Characteristics

1. Closely aligned with upstream raw fields
2. No business semantics introduced
3. Serves as the data source for unified models (`uniform-data`)

---

### 4.2 platform-safe

Interface definitions for token security detection and risk assessment platforms.

Currently integrated:

GoPlusLabs

#### Use Cases

1. Token risk identification
2. High-risk asset filtering
3. Security screening before ranking and exposure

---

### 4.3 uniform-data

Defines the **internal unified data model**, and serves as the **stable API Contract Layer** for external output, directly consumed by the frontend.

#### Design Purpose

Due to significant differences in API response structures across platforms, this layer standardizes the data model:

1. Stable field definitions
2. Consistent semantics
3. Frontend-friendly structure

#### Main Consumers

1. Frontend API responses
2. Ranking and scoring outputs
3. Aggregated token data views

---

## 5.0 interface-base

A system-level base type definition module shared across all subsystems.

Main contents include:

1. Chain type definitions (EVM / Solana, etc.)
2. Time windows and time-related constants
3. Cross-module shared base types

This module contains **no platform-specific or business logic**.

---

## 6.0 interface-task

Defines types and structures related to **scheduled tasks (Task) and the scheduling system**.

This directory is only used to define:

1. Key types used in scheduled tasks
2. Pagination state structures
3. Read-only data structures required for task initialization

It does **not include**:

1. Data fetching logic
2. Data transformation logic
3. Sorting, scoring, or computation logic

---

### 6.1 uniform-data

Defines a unified **Key system and state structures** for task scheduling scenarios.

This layer mainly serves:

1. Scheduled tasks (Cron / second-level scheduling)
2. Task distribution across multi-chain × multi-ranking × multi-time-window
3. Unified management of ranking pagination states

#### Current Definitions

1. Chain + ranking type keys (e.g., `trending`, `new`)
2. Combined keys of chain + ranking + time granularity
3. Pagination state structure (`current_page` / `max_page`)
4. Empty data initialization structures

---

## 7.0 interface-utils

A shared backend utility module reused across multiple services.

Characteristics:

1. Pure functions
2. Deterministic output

Includes:

1. `math.ts` — Numeric computation and precision-safe utilities
2. `sort.ts` — Sorting helper functions
3. `time.ts` — Time constants and time window utilities

---

## 8.0 Design Principles

1. Core modules define **interfaces and types only**
2. Utility modules provide **pure function implementations**
3. Strong typing is preferred over implicit conventions
4. Clearly distinguish the following data layers:

   1. Upstream raw data (Raw Data)
   2. Unified system data (Uniform Data)
   3. Frontend consumption model (View Model)
5. Designed for future extensibility and data source replacement

---

### 8.1 Dependency Direction Constraints

To ensure a clear and maintainable interface layer, dependencies must follow a **strict one-way flow**:

```
raw (platform-data / platform-safe)
→ uniform-data
→ task / controller
```

The following are **not allowed**:

1. `uniform-data` depending on `raw` (reverse dependency)
2. `task` directly depending on `raw` (bypassing `uniform-data`)
3. Cross-layer circular dependencies

All dependencies must flow **top-down in a single direction**.

---

## Contact

If you have any questions, suggestions, or collaboration ideas:

* GitHub: [github.com/yu-moxing](https://github.com/yu-moxing)
* Telegram: [t.me/yu_moxing](https://t.me/yu_moxing)
* Email: [gorank1024@gmail.com](mailto:gorank1024@gmail.com)

---