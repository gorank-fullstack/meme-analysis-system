---

# src/task Module Overview (Scheduled Tasks & Unified Data Production)

The `src/task` directory represents the **“data production and scheduling layer”** of the entire system.
Its primary responsibilities include:

* **Running scheduled jobs (Cron / Interval)**
* **Periodically calling external APIs**
* **Handling paginated data fetching and state management**
* **Feeding raw results into the `sort` module for hotness and scoring calculations**
* **Producing final sorted results that can be directly consumed by the API layer**

> ⚠️ The `task` module is **NOT an API aggregation layer**, and it **does NOT return data directly to the frontend**.
> Its core responsibility is:
> **“Continuously, stably, and controllably producing the raw data required for sorting.”**

---

## 1. Module Positioning

### Responsibility Boundaries of `src/task`

| Module       | Responsibility                                                                  |
| ------------ | ------------------------------------------------------------------------------- |
| `api`        | Encapsulates API requests to external platforms (e.g. GeckoTerminal)            |
| `task`       | Scheduled API calls → paginated fetching → driving the sorting system           |
| `sort`       | Hotness calculation, scoring, clipping, and sorting based on task-provided data |
| `controller` | Exposes query APIs (read-only, no external API calls)                           |

**One-sentence summary:**

> `task` = backend “perpetual engine” continuously feeding data
> `sort` = ranking and scoring brain
> `controller` = query出口 (query endpoint)

---

## 2. Directory Structure

```text
src/task
├── README.md
└── uniform-data
    └── task-gr
        ├── task-gr.controller.ts
        ├── task-gr.service.ts
        └── task-gr.module.ts
```

---

## 3. task-gr Module Overview (GeckoTerminal Data Tasks)

`task-gr` is currently the most critical sub-module within `task`.
It is responsible for **scheduled fetching and paginated traversal of GeckoTerminal (GR) Token / Pool data**.

---

### 1️⃣ task-gr.controller.ts (Read-only Query Interface)

**Role Definition:**

* Provides **query entry points** for frontend / API consumers
* **Does NOT call external APIs directly**
* Data sources:

  * Results produced by `task` scheduled jobs
  * Final outputs from the `sort` module
* Uses a unified Redis interceptor with TTL control

#### Key Features

* Uses `RedisPlusInterceptor`
  👉 Custom IoRedis-based interceptor, avoiding `cache-manager`
* Uses `@CacheTTL(getApiTTL)`
  👉 Decouples API cache TTL from task update frequency
* Implements **safe parameter fallbacks**

  * Invalid `chainType` → defaults to `sol`
  * Invalid `duration` → defaults to `5m`

#### Example Route

```text
GET /task-gr/:chainType/trending_pools_:duration/:pageStr
```

Returned data comes from:

```ts
TaskGrService.getTrendingPools_v2()
```

---

### 2️⃣ task-gr.service.ts (Core Task Scheduling & State Management)

This file is the **core engine of `task-gr`**.

#### Responsibility Breakdown

---

##### ✅ Scheduled Task Execution

Uses `@Interval` instead of plain `@Cron` to achieve **chain-specific frequency control**:

| Chain | Interval    |
| ----- | ----------- |
| sol   | 50 seconds  |
| bsc   | 120 seconds |
| eth   | 260 seconds |

```ts
@Interval(TASK_INTERVAL_EXPRESSION.EVERY_50_SECOND)
doGetGrTokenSortItem_sol_trending_pools_5m()
```

---

##### ✅ Chain-Level Switch Control (Task Gray Release)

```ts
private readonly task_Get_GrToken_On_ChainName_Status: Record<TChainName, boolean>
```

Allows, **without modifying scheduling code**:

* Disabling data fetching for a specific chain
* Supporting gray releases, testing, and risk control

---

##### ✅ Pagination State Management (Core Design)

```ts
private readonly taskPage_v2: Record<
  T_ChainNameTab_And_qtType_Key_new,
  IPageFields
>
```

Key characteristics:

* **Each chain + tab + duration maintains its own pagination state**
* Uses a `readonly container + mutable internal fields` pattern
* Prevents pagination interference caused by shared object references

```ts
toPage(chainTab_And_Duration_Key)
```

Safely advances the pagination cursor.

---

##### ✅ Data Fetching → Sorting System Integration

```ts
getTaskGrToken_fromApi(...)
```

After fetching completes:

```ts
this.sortHotService.updateGrTokenSortItems(chainName, lastGrTokenSortItem);
```

**The task layer does not perform sorting — it only feeds data.**

---

##### ✅ Temporary and Historical Data Structures

```ts
tempGrSortItemList     // Temporary data within the current pagination cycle
historyGrSortItemList // Historical data (reserved for future use)
```

The code explicitly documents:

* JavaScript arrays are **reference types**
* When shallow copies (`[...]`) are required
* When direct reassignment is sufficient

---

### 3️⃣ task-gr.module.ts (Module Role Explanation)

Although named `module.ts`, its core purpose is:

> **To assemble all dependencies required by task-gr into the NestJS DI container**

Including:

* `ApiGrService` (external API access)
* `SortHotService` (sorting system)
* `IoRedis` (cache / state storage)
* Scheduled task dependencies (`ScheduleModule`)

**This module acts as the “runtime container” for task-gr, not a logic layer.**

---

## 4. End-to-End Data Flow

```text
Scheduler Trigger
   ↓
task-gr.service
   ↓
getTaskGrToken_fromApi
   ↓
Raw Token / Pool List
   ↓
sortHotService.updateGrTokenSortItems
   ↓
Ranking / Hotness / Clipping
   ↓
Controller Query API
```

---

## 5. Design Principles Summary

### ✔ The task module does only three things

1. **Scheduling**
2. **Pagination**
3. **Feeding data into sort**

### ❌ What task explicitly does NOT do

* Does not serve the frontend directly
* Does not implement complex sorting logic
* Does not handle UI / DTO transformations
* Does not manage API-layer cache strategies

---

## 6. Maintenance Guidelines

* **Adding a new chain**
  1️⃣ Enable it in `task_Get_GrToken_On_ChainName_Status`
  2️⃣ Configure its Interval
* **Adding a new duration (e.g. 15m)**

  * Update `TASK_PAGE_MAP_V2` accordingly
* **Frequency tuning**

  * Prefer adjusting `TASK_INTERVAL_EXPRESSION`

---
