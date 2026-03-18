---

# 📁 src/utils

This directory represents the system’s **core utility and algorithm layer**, responsible for:

* Normalizing data structures and differences across third-party APIs
* Providing common formatting and safety utilities
* Implementing the core Token hotness scoring and ranking algorithms
* Isolating business logic from API / storage layers to ensure long-term evolvability

---

## 📂 Directory Structure Overview

```
src/utils
├─ api/                    # Third-party API wrappers & unified data processing
├─ format/                 # Data formatting and presentation utilities
├─ sort/
│  └─ uniform-data/        # Core Token hotness scoring & ranking algorithms
├─ task/
│  └─ time-task-helper.ts  # Cron time-window & idempotent execution helper
└─ README.md
```

---

## 📂 src/utils/api

### Responsibility & Scope

The `api` directory is used to:

* Encapsulate data access logic from Redis / external APIs / cache layers
* Normalize return structures to prevent business logic from depending on third-party differences
* Provide stable, **pre-processed** data entry points

**Design Principles:**

* Does **not** participate directly in UI or business decision logic
* Contains **no** scoring or ranking algorithms
* Focuses only on: **fetching · organizing · unifying** data

### Typical Use Cases

* Reading Token lists from Redis or external APIs
* Merging multi-source data into the `uniform-data` structure
* Abstracting field differences between chains (EVM / SPL)

---

## 📂 src/utils/format

### Responsibility & Scope

The `format` directory provides:

* Formatting utilities for numbers, timestamps, ratios, etc.
* Shared presentation helpers for UI and API layers
* A single place to avoid duplicated formatting logic inside components

### Typical Functions

* Market cap and volume scaling (K / M / B)
* Percentage and decimal precision handling
* Timestamp and relative time conversion

**Conventions:**

* Handles **presentation semantics only**
* Introduces no business logic
* Has no dependency on ranking or scoring results

---

## 📂 src/utils/sort/uniform-data

> 🔥 **The Core of the Token Hotness Scoring & Ranking System**

This is the **most critical and irreplaceable algorithm module** in the entire system.

---

### 🧠 Module Positioning

This directory implements:

* Token hotness scoring (Hot Score)
* Multi-timeframe rankings (5m / 1h / 6h / 24h)
* Anti-manipulation, anti-bot, and risk-based down-weighting
* Pruning, rebuilding, and explainable sorting of hotness data

It is a **parameterized, explainable, and extensible** scoring system.

---

### 📄 Core Files

#### 1️⃣ `sort-hot_rank.ts`

*(source code omitted, not open-sourced)*

🔥 **Hotness calculation & ranking engine (main pipeline)**

Primary responsibilities:

* Lifecycle management of the hotness map
* Calculation of active trading volume
* Ranking construction and clipping
* Synchronized updates across multiple timeframes

##### Core Pipeline

*(execution order must not be changed)*

1. **`prune_And_ResetZero_HotMap`**

   * Remove expired Tokens
   * Manage hit counters and reset cycles

2. **`filterHighRiskToken`** *(optional)*

   * Chain-specific risk filtering (EVM / SOL)
   * Direct exclusion of high-risk Tokens

3. **`calculateActiveTradingVolume`**

   * Core scoring stage
   * Computes `lv_0_hot_vol[qt]`
   * Applies multi-dimensional weights and correction factors

4. **`rebuildSortedList`**

   * Supports sorting by arbitrary fields
   * Supports numeric / string / time-based fields

5. **`clipHotMap`**

   * Trims oversized datasets
   * Prioritizes recently-hit Tokens

---

#### 2️⃣ `sort-hot_rule.ts`

*(source code omitted, not open-sourced)*

🧮 **Scoring rules & weight function definitions**

Centralizes all scoring factors to prevent rule logic from being scattered across the main pipeline.

##### Rule Characteristics

* Fully **function-based**
* **Replaceable** and **tunable**
* Designed for long-term evolution

---

### 🧩 Scoring System Design Notes

* **Lv0 / Lv1 / Lv2 tiered scoring structure**
* All intermediate calculation results are traceable
* Supports exporting scoring formula strings (development/debug only)
* No database dependency, no side effects

---

### ⚠️ Critical Design Constraints

* **EVM and SPL security models must never be forcibly unified**
* The sorting module is independent of UI, API, and storage layers
* All scores depend exclusively on `uniform-data` input
* This module is part of the system’s **core intellectual assets** — modify with extreme caution

---

## 📂 src/utils/task

### Responsibility & Scope

The `task` directory contains **shared helpers for scheduled tasks**, primarily addressing:

* **Duplicate execution issues** in high-frequency NestJS `@Cron` jobs
* **Multiple-trigger risks** caused by second-level jitter, service restarts, or scheduling delays
* Poor readability and maintainability of complex Cron expressions

The goal of this directory is:

> **Ensure scheduled tasks run exactly once — and only in the minute they are supposed to.**

---

## 📄 time-task-helper.ts

### 🧠 Module Positioning

`TimeTaskHelper` is a **Cron fault-tolerance and idempotent execution helper**, designed to be used alongside the NestJS `@Cron` decorator.

Without altering Cron’s native scheduling behavior, it provides:

* ✅ **Execution limited to once per minute**
* ✅ **Second-level tolerance windows**
* ✅ **Support for multiple minutes / interval minutes**
* ✅ **Support for fixed hours / interval hours**
* ✅ **Protection against jitter and duplicate triggers**

---

### 🎯 Design Goals

1. **No dependency on Redis or databases**
2. **Zero intrusion into business logic**
3. Responsible only for **“should this execution happen?”**
4. Converts Cron expressions into **readable parameter structures**
5. Logic is **auditable and deterministic**

---

## 📌 Overall Design Principles

* utils ≠ simple helpers
* sort ≠ basic sorting
* All complexity is concentrated in the algorithm layer
* Upper layers (API / UI) remain as **simple and lightweight as possible**

---