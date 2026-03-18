---

# src/task 模块说明（定时任务与统一数据生产）

`src/task` 目录是整个系统中 **“数据生产与调度层”**，主要负责：

* **通过定时任务（Cron / Interval）**
* **周期性调用外部 API**
* **对数据进行分页拉取、状态管理**
* **将原始结果送入 sort 模块进行热度与评分计算**
* **最终产出可被 API 层直接读取的排序结果**

> ⚠️ `task` 模块 **不是 API 聚合层**，也 **不直接面向前端返回数据**
> 它的核心职责是：**“持续、稳定、可控地生产排序所需的数据原料”**

---

## 一、模块整体定位

### src/task 的职责边界

| 模块           | 职责                                |
| ------------ | --------------------------------- |
| `api`        | 对外部平台（如 GeckoTerminal）进行 API 请求封装 |
| `task`       | 定时调度 API → 拉取分页数据 → 驱动排序系统        |
| `sort`       | 对 task 提供的数据进行热度、评分、裁剪、排序         |
| `controller` | 对外提供查询接口（只读，不再请求外部 API）           |

**一句话总结：**

> `task` = 后台“永动机”，持续喂数据
> `sort` = 排序与评分大脑
> `controller` = 查询出口

---

## 二、目录结构

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

## 三、task-gr 模块说明（GeckoTerminal 数据任务）

`task-gr` 是当前最核心的 task 子模块，负责 **GeckoTerminal（GR）Token / Pool 数据的定时拉取与分页推进**。

### 1️⃣ task-gr.controller.ts（只读查询接口）

**职责定位：**

* 提供给前端 / API 层的 **查询入口**
* **不直接请求外部 API**
* 数据来源：`task` 定时任务 + `sort` 排序结果
* 统一使用 Redis 拦截器 + TTL 控制

#### 核心特性

* 使用 `RedisPlusInterceptor`
  👉 自定义 IoRedis 拦截器，避免使用 `cache-manager`
* 使用 `@CacheTTL(getApiTTL)`
  👉 API 层缓存 TTL 与 task 更新频率解耦
* 对参数进行 **安全兜底**

  * 非法 `chainType` → 默认 `sol`
  * 非法 `duration` → 默认 `5m`

#### 示例路由

```text
GET /task-gr/:chainType/trending_pools_:duration/:pageStr
```

返回内容来自：

```ts
TaskGrService.getTrendingPools_v2()
```

---

### 2️⃣ task-gr.service.ts（核心任务调度与状态管理）

这是 **task-gr 的核心引擎**。

#### 核心职责拆解

##### ✅ 定时任务调度

使用 `@Interval` 而非单纯 `@Cron`，实现**链级别差异化频率控制**：

| Chain | Interval |
| ----- | -------- |
| sol   | 50 秒     |
| bsc   | 120 秒    |
| eth   | 260 秒    |

```ts
@Interval(TASK_INTERVAL_EXPRESSION.EVERY_50_SECOND)
doGetGrTokenSortItem_sol_trending_pools_5m()
```

---

##### ✅ 链级开关控制（任务灰度）

```ts
private readonly task_Get_GrToken_On_ChainName_Status: Record<TChainName, boolean>
```

* 可在 **不改调度代码** 的前提下：

  * 关闭某条链的数据拉取
  * 用于灰度、测试、风控

---

##### ✅ 分页状态管理（核心设计点）

```ts
private readonly taskPage_v2: Record<
  T_ChainNameTab_And_qtType_Key_new,
  IPageFields
>
```

特点：

* **每个 chain + tab + duration 拥有独立分页状态**
* 使用 `readonly + 内部字段可变` 的设计
* 避免对象引用共享导致的分页串扰问题

```ts
toPage(chainTab_And_Duration_Key)
```

用于安全推进分页指针。

---

##### ✅ 数据拉取 → 排序系统对接

```ts
getTaskGrToken_fromApi(...)
```

拉取完成后：

```ts
this.sortHotService.updateGrTokenSortItems(chainName, lastGrTokenSortItem);
```

**task 不负责排序，只负责喂数据**。

---

##### ✅ 临时数据与历史数据结构

```ts
tempGrSortItemList     // 当前翻页周期内的临时数据
historyGrSortItemList // 历史数据（预留）
```

并在代码中明确强调：

* JS 数组是 **引用类型**
* 什么时候需要 `[...]` 浅拷贝
* 什么时候直接重新赋值即可

---

### 3️⃣ task-gr.module.ts（模块角色说明）

虽然文件名为 `module.ts`，但其核心意义在于：

> **将 task-gr 所需的依赖一次性组合进 NestJS DI 容器**

包括：

* `ApiGrService`（外部 API）
* `SortHotService`（排序系统）
* `IoRedis`（缓存 / 状态存储）
* 定时任务装饰器依赖（ScheduleModule）

**该模块是 task-gr 的“运行容器”，而非逻辑层。**

---

## 四、数据流全链路说明

```text
定时器触发
   ↓
task-gr.service
   ↓
getTaskGrToken_fromApi
   ↓
原始 Token / Pool 列表
   ↓
sortHotService.updateGrTokenSortItems
   ↓
排序 / 热度 / 剪裁
   ↓
controller 查询接口
```

---

## 五、设计原则总结

### ✔ task 模块只做三件事

1. **定时**
2. **分页**
3. **投喂 sort**

### ❌ task 明确不做的事

* 不直接对前端负责
* 不做复杂排序逻辑
* 不做 UI / DTO 转换
* 不处理 API 层缓存策略

---

## 六、维护建议

* **新增链**：
  1️⃣ 打开 `task_Get_GrToken_On_ChainName_Status`
  2️⃣ 配置 Interval
* **新增 duration（如 15m）**：
  同步更新 `TASK_PAGE_MAP_V2`
* **调频优化**：
  优先改 `TASK_INTERVAL_EXPRESSION`

---