---

# Redis Layer (Cache Layer)

This directory implements the **Redis cache layer** of the Meme Analysis System backend, designed to improve overall performance and stability under **high concurrency, read-heavy workloads, and large JSON payload scenarios**.

The Redis layer consists of two parts:

1. **RedisCacheService**
   👉 Provides explicit and controllable Redis read/write capabilities (with optional compression)

2. **RedisPlusInterceptor**
   👉 Provides transparent HTTP API–level response caching via an interceptor

---

## 📐 Design Goals

* Improve API response time and reduce repeated computation
* Reduce pressure on third-party services (on-chain / off-chain APIs)
* Support efficient storage of large JSON payloads
* Keep behavior predictable and avoid “implicit cache magic”

---

## 🧱 Module Structure

```
src/redis/
├─ redis.service.ts                 # Core Redis cache service
├─ interceptors/
│  └─ redis.plus-interceptor.ts     # HTTP cache interceptor
├─ redis.constants.ts               # Cache-related metadata definitions
```

---

## 🧩 RedisCacheService

`RedisCacheService` is a **low-level, explicit, performance-oriented Redis cache service** intended for direct use by internal backend modules.

### Core Capabilities Overview

✅ Single-key / multi-key read & write
✅ JSON string storage
✅ Dual paths: GZIP-compressed / non-compressed
✅ TTL jitter to prevent cache avalanche
✅ Safe JSON.parse to avoid process crashes caused by corrupted data

---

### 1️⃣ Single-Key Read / Write (Non-compressed)

```ts
getKey<T>(key)
setKey<T>(key, value, ttlSec)
delKey(key)
```

**Characteristics**

* Data is stored as JSON strings
* Writes are skipped (with logs) when value is `null` or `undefined`
* Uses safe JSON.parse; returns `null` on parse failure

**Typical Use Cases**

* Small structured data
* Configurations, state flags, ranking summaries

---

### 2️⃣ Batch Key Read / Write (Non-compressed)

```ts
mGetKeys<T>(keys[])
mSetKeys([{ key, value, ttlSec }])
mDelKeys(keys[])
```

**Characteristics**

* Read order strictly matches the input `keys` order
* Writes are executed key by key to avoid large-batch failures
* Invalid values are automatically skipped

**Typical Use Cases**

* Ranking lists
* Aggregated multi-token states
* Paginated cache data

---

### 3️⃣ Single-Key Read / Write (GZIP-compressed)

```ts
getKeyGz<T>(key)
setKeyGz<T>(key, value, ttlSec)
```

**Implementation Details**

* JSON payloads are compressed using GZIP (`Z_BEST_SPEED`)
* Data is stored in Redis as binary `Buffer`
* Automatic TTL jitter (default ±5%)
* Decompression followed by safe JSON parsing

**Typical Use Cases**

* Very large JSON payloads
* Solscan / Moralis transaction details
* On-chain detailed datasets

---

### 4️⃣ Batch Key Read / Write (GZIP-compressed)

```ts
mGetKeysGz<T>(keys[])
mSetKeysGz([{ key, value, ttlSec }])
```

**Characteristics**

* Uses `mgetBuffer` to avoid intermediate string conversion
* Strict key order preservation
* Optimized for batch access to large data payloads

---

### 5️⃣ Development-only Utilities

```ts
clearDev()
```

* Allowed only when `NODE_ENV=development`
* Used for quickly clearing local Redis data
* Production environments must be cleared manually via CLI

---

### Design Principles (RedisCacheService)

* Contains no business logic
* Does not infer compression strategy automatically (caller decides)
* Explicit separation between compressed and non-compressed paths
* Predictable behavior with fully controllable performance characteristics

---

## 🚦 RedisPlusInterceptor (HTTP Cache Interceptor)

`RedisPlusInterceptor` provides **API-level transparent caching** for HTTP `GET` endpoints by caching full response payloads.

---

### Workflow

1. Generate a cache key based on the incoming request
2. Query Redis for an existing cached value
3. If hit, return the cached response immediately
4. If missed, execute the controller logic
5. Cache the response after request completion

---

### Supported Scope

* **HTTP Method**: `GET` only
* **Cache Granularity**: API response
* **Serialization**: JSON
* **Storage Backend**: Redis (ioredis)

---

### Cache Key Rules (Query Parameters Supported)

Cache keys are composed as:

```
METHOD:URL?sorted_query_params
```

Example:

```
GET:/api/tokens?keyword=abc&minFdv=100
```

Query parameters are **sorted alphabetically** to ensure:

```
?a=1&b=2 === ?b=2&a=1
```

This avoids cache misses caused by parameter order differences.

---

### Cache Hit / Miss Behavior

* **Cache Hit**

  * Cached data is returned directly from Redis
  * Controller logic is skipped
  * Response header:

    ```
    X-Cache: HIT
    ```

* **Cache Miss**

  * Business logic executes normally
  * Response is cached after completion
  * Response header:

    ```
    X-Cache: MISS
    ```

---

### TTL Resolution Order

TTL is resolved from metadata in the following priority order:

1. Method-level `@CacheTTL`
2. Class-level `@CacheTTL`
3. Permanent cache if not specified

TTL also supports **function-based definitions** for dynamic per-request calculation.

---

### Safety & Fault Tolerance

* Responses of type `StreamableFile` are not cached
* Redis failures automatically degrade without affecting API availability
* JSON serialization failures are logged but do not interrupt request handling

---

### Design Principles (Interceptor)

* No cache invalidation logic
* No automatic refresh
* No compression logic
* Focused solely on interception and response return

---

## 🧠 Usage Recommendations

| Scenario                 | Recommended Approach     |
| ------------------------ | ------------------------ |
| High-frequency GET APIs  | RedisPlusInterceptor     |
| Complex business caching | RedisCacheService        |
| Very large JSON payloads | GZIP-based methods       |
| Rankings / aggregations  | Batch cache APIs         |
| Fine-grained control     | Manual RedisCacheService |

---

## 📌 Summary

This Redis layer adopts a **dual-cache strategy: explicit cache + interceptor cache**:

* **Interceptor**: covers ~80% of standard API response caching
* **Service**: handles the remaining ~20% high-complexity, performance-critical scenarios

This approach maximizes performance while keeping system complexity and cognitive overhead to a minimum.

---