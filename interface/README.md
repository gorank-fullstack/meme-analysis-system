---

## 📘 interface/README.md

```md
# Interface Layer

This directory defines the **data contracts, interface protocols, and shared type definitions**
for the Meme Analysis System monorepo.

It serves as the system’s **Boundary Layer**, responsible for isolating and standardizing
data interactions between the following modules:

- External data sources (on-chain / off-chain third-party APIs)
- Backend services (NestJS)
- Frontend consumers (Next.js)

This directory **contains no business logic implementations**.
It is used exclusively to define:
- TypeScript interfaces and types
- Upstream API data structures
- Unified data formats
- Shared constants and utility types
```

---

## 📂 Directory Structure

```md
## Directory Layout

interface/
├─ axios-client/              # HTTP client wrapper (based on Axios)
├─ interface-api/             # Third-party API interface definitions
│  ├─ platform-data/          # Market data / on-chain data platforms
│  ├─ platform-safe/          # Token security & risk assessment platforms
│  └─ uniform-data/           # Unified data structures exposed to frontend
├─ interface-base/            # Base type definitions (chain types, time windows, etc.)
├─ interface-task/            # Interfaces for scheduled tasks and job orchestration
├─ interface-utils/           # Shared utility modules (math, sorting, time)
```

---

## 🌐 axios-client

```md
## axios-client

A unified HTTP client wrapper used by all backend modules
to access external APIs.

### Responsibilities
- Centralized Axios instance creation and configuration
- Default timeout and headers management
- Request and response interceptors
- Unified injection of authentication data (e.g. API tokens)

### Design Notes
- Contains no platform-specific logic
- Reusable across multiple API modules
```

---

## 🔌 interface-api

```md
## interface-api

Defines **raw API data structures** for third-party platforms.

Interfaces in this layer **strictly mirror upstream API responses**.
No normalization or unification is performed here.
They are primarily used to:
- Describe actual returned fields
- Serve as input for data transformation and scoring logic
```

---

### 📊 platform-data

```md
### interface-api/platform-data

Interface definitions for market data and on-chain data platforms,
currently including:

- GeckoTerminal
- Moralis
- Solscan

### Characteristics
- Closely aligned with upstream API field definitions
- No business semantics introduced
- Acts as the data source for unified structures (uniform-data)
```

---

### 🛡 platform-safe

```md
### interface-api/platform-safe

Interface definitions for token security analysis
and risk assessment platforms.

Currently integrated:
- GoPlusLabs

### Usage Scenarios
- Token risk identification
- High-risk asset filtering
- Security screening before ranking or exposure
```

---

### 🔄 uniform-data

```md
### interface-api/uniform-data

Defines **unified data structures** consumed by the frontend.

### Design Purpose
API responses from different platforms vary significantly.
This layer is responsible for transforming multi-source data into formats that are:
- Field-stable
- Semantically consistent
- Ready for direct frontend consumption

### Primary Consumers
- Frontend API responses
- Ranking and scoring outputs
- Aggregated token data views
```

---

## 🧱 interface-base

```md
## interface-base

System-level base type definitions shared across all subsystems.

Includes:
- Chain type definitions (EVM / Solana, etc.)
- Time window and interval constants
- Cross-module foundational types

This module contains no platform-specific or business logic.
```

---

## ⏱ interface-task

The **type and structure definition layer** for scheduled tasks
and the job orchestration system.

This directory is used exclusively to define:

* Key types used in scheduled tasks
* Pagination state structures
* Read-only data structures required for task initialization

❗ Does NOT include:

* Data fetching logic
* Data transformation logic
* Sorting, scoring, or calculation logic

---

### interface-task/uniform-data

Defines a **unified key system and state structures**
specifically for task scheduling scenarios.

This layer primarily supports:

* Scheduled jobs (Cron / high-frequency tasks)
* Multi-chain × multi-ranking × multi-timeframe task dispatching
* Unified pagination state management for ranking tasks

### Currently includes only the following definitions

* Chain + ranking type keys (e.g. trending / new)
* Composite keys: chain + ranking + time granularity
* Task pagination state structures (`current_page / max_page`)
* Empty-state initialization structures for each task dimension

---

## 🧰 interface-utils

```md
## interface-utils

Shared backend utility modules reused across multiple services.

Includes:
- math.ts   —— Numeric calculations and precision-safe helpers
- sort.ts   —— General-purpose sorting utilities
- time.ts   —— Unified time constants and time window definitions

### Design Principles
- No side effects
- No external service dependencies
- Pure functions with deterministic output
```

---

## 🧠 Design Principles

```md
## Design Principles

- Define interfaces and types only; no business logic implementation
- Strong typing is preferred over implicit conventions
- Clearly distinguish between the following data layers:
  - Raw upstream platform data
  - Unified internal system data structures
  - Frontend-ready consumable data formats
- Designed to support future data source expansion or replacement
```

---
