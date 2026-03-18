---

# src/sort Module Overview (Sorting & Scoring)

The `src/sort` directory serves as the **aggregation and orchestration layer for Token sorting logic**.
Its responsibility is to organize various sorting rules, heat calculations, and scoring results into **final, consumable ranking outputs**.

This module **does not perform data fetching** and **does not directly expose HTTP APIs**.
Instead, it acts as an internal **sorting engine**, invoked by the Task and Controller layers.

---

## Directory Structure

```text
src/sort
└─ uniform-data
   ├─ sort-hot
   │  └─ sort-hot.service.ts
   └─ sort-new
      └─ (reserved, not implemented yet)
```

---

## uniform-data

`uniform-data` means:

> **Sorting and scoring based on a unified Token data structure (`IGrTokenSortItem`)**

All sorting logic under this directory is **agnostic to data sources**
(API / Cache / File).
It only processes **already normalized Token data**.

---

## sort-hot (Implemented)

### Purpose

The `sort-hot` module implements the **complete lifecycle of Token heat ranking and scoring**, including:

* Heat hit detection and accumulation
* Multi–time-window statistics (5m / 1h / 6h / 24h)
* Heat score calculation
* Ranking list generation
* Paginated ranking output
* Multi-level persistence and recovery:
  **Memory → Redis → File**

It is one of the **most critical and complex** sorting modules in the system.

---

### Responsibilities of `sort-hot.service.ts`

`SortHotService` is a **long-lived, in-memory, stateful service**.
Its responsibilities include:

---

#### 1️⃣ In-Memory Heat State Management

Each chain maintains its own independent structures:

* `hotGrTokenSet`
  Set of Tokens that have already been hit
* `hotGrTokenMap`
  Token → latest full Token information
* `hot`
  Heat maps split by `chain + qt`
* `hotGrTokenSortList`
  Final sorted ranking lists (Server DTOs)

> In-memory state is the **primary battlefield for heat calculation**.
> Redis and files are only used for backup and recovery.

---

#### 2️⃣ Heat Sampling & Market Cap Curve (`cmc_m_arr`)

* Sampling interval is dynamically adjusted based on
  **Token creation time (`c_t_sec`)**
* Uses a **table-driven sampling strategy (`CMC_SAMPLE_TABLE_144`)**
* Each Token keeps **up to 144 sampling points**
* Missing points are automatically filled using **linear interpolation**
* Designed for later trend analysis and score adjustment

This mechanism is specifically designed to achieve:

> **High sensitivity for new Tokens, smooth behavior for old Tokens**

---

#### 3️⃣ Heat Refresh & Ranking Generation

Whenever new Token data is updated:

* Hit or register the Token
* Update heat maps
* Invoke `refreshHotMapAndRanking`
* Regenerate ranking lists for:

  * each chain
  * each time window

---

#### 4️⃣ Scheduled Tasks (Cron)

Implemented using `@nestjs/schedule` + `TimeTaskHelper` to guarantee
**high fault tolerance and single execution per time window**.

| Task                 | Schedule                | Description                              |
| -------------------- | ----------------------- | ---------------------------------------- |
| Save heat logs       | Daily at 23:58          | For offline statistics and analysis only |
| Persist Map to file  | Every 2 hours           | Used for data recovery after restart     |
| Persist Map to Redis | Hourly at minute 1 / 31 | Short-term cache + fast recovery         |
| Test task            | Every 5 minutes         | Debugging / verification                 |

---

#### 5️⃣ Startup Recovery Logic (`onModuleInit`)

On service startup, each chain is processed sequentially:

1. **Load from Redis first**
2. If Redis fails and allowed → load from file
3. If loading succeeds:

   * Clean expired data
   * Rebuild ranking lists

Whether Redis or file loading is allowed is precisely controlled by:

```ts
LOAD_MAP_FROM_CACHE[chain]
LOAD_MAP_FROM_FILE[chain]
```

---

#### 6️⃣ External Interfaces

* `updateGrTokenSortItems`

  * Called by the Task layer
  * Injects newly fetched Token data into the heat system

* `getChainQtHotGrTokenSortList`

  * Accepts:

    * chain
    * qt (5m / 1h / 6h / 24h)
    * page
  * Returns paginated ranking results

---

## sort-new (Reserved)

### Design Intent

`sort-new` is intended to implement **“New Token ranking”**.
It is conceptually parallel to `sort-hot`, but with different priorities:

* Emphasizes:

  * Creation time
  * Growth speed
  * Initial trading behavior
* Does **not** focus on long-term heat accumulation

Currently, only the directory and interface placeholders are kept.
Implementation will be added once the strategy is finalized.

---

## Design Principles Summary

* **Centralized sorting logic, cohesive state**
* **No tight coupling with data fetching**
* **Memory-first, cache / file as fallback**
* **Rule-table driven, not hard-coded**
* **“New Token sorting” intentionally unimplemented, interface reserved**

---