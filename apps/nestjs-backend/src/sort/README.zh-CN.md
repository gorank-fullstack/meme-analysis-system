---

# src/sort 模块说明（排序与评分）

`src/sort` 目录用于 **Token 排序逻辑的聚合与调度层**，负责把各类排序规则、热度计算、评分结果组织成**可直接对外提供的排序结果**。

该目录本身 **不负责数据抓取**，也 **不直接暴露 HTTP 接口**，而是作为服务内部的「排序引擎模块」，由 Task / Controller 层调用。

---

## 目录结构

```text
src/sort
└─ uniform-data
   ├─ sort-hot
   │  └─ sort-hot.service.ts
   └─ sort-new
      └─ （预留，待实现）
```

---

## uniform-data 说明

`uniform-data` 表示：

> **基于统一 Token 数据结构（IGrTokenSortItem）进行排序与评分**

该目录下的排序逻辑 **不关心数据来源**（API / Cache / File），只处理已经标准化后的 Token 数据。

---

## sort-hot（已实现）

### 功能定位

`sort-hot` 模块实现的是 **Token 热度排序与评分的完整生命周期**，包括：

* 热度命中与累积
* 多时间窗口（5m / 1h / 6h / 24h）热度统计
* 热度评分计算
* 排行榜生成
* 排序结果分页输出
* 内存 → Redis → 文件 的多级持久化与恢复

它是当前系统中 **最核心、最复杂** 的排序模块之一。

---

### sort-hot.service.ts 职责概览

`SortHotService` 是一个 **常驻内存的状态型服务**，主要职责包括：

#### 1️⃣ 内存态热度结构维护

* 每条链维护独立结构：

  * `hotGrTokenSet`：是否已命中的 Token 集合
  * `hotGrTokenMap`：Token → 最新完整信息
  * `hot`：按 chain + qt 维度拆分的热度 Map
  * `hotGrTokenSortList`：最终排序后的结果列表（Server DTO）

> 内存态是**热度计算的主战场**，Redis / 文件只是备份与恢复手段。

---

#### 2️⃣ 热度采样与市值曲线（cmc_m_arr）

* 基于 **Token 上线时间（c_t_sec）** 动态调整采样间隔
* 采用 **表驱动采样策略（CMC_SAMPLE_TABLE_144）**
* 每个 Token 最多保留 **144 个采样点**
* 采样不足时自动进行 **线性插值补点**
* 用于后续热度趋势分析与评分修正

这一部分是为 **“新币敏感、老币平滑”** 专门设计的。

---

#### 3️⃣ 热度刷新与排行榜生成

* 每次有新 Token 数据更新时：

  * 命中或新增 Token
  * 更新热度 Map
  * 调用 `refreshHotMapAndRanking`
  * 重新生成各链 / 各时间窗口的排序列表

---

#### 4️⃣ 定时任务（Cron）

使用 `@nestjs/schedule` + `TimeTaskHelper` 实现 **高容错、单次执行保证** 的定时任务：

| 任务             | 频率           | 说明           |
| -------------- | ------------ | ------------ |
| 保存热度日志         | 每天 23:58     | 仅用于后续统计分析    |
| 保存 Map 到文件     | 每 2 小时       | 用于程序重启后的数据恢复 |
| 保存 Map 到 Redis | 每小时 1 / 31 分 | 短期缓存 + 快速恢复  |
| 测试任务           | 每 5 分钟       | 调试 / 验证用     |

---

#### 5️⃣ 启动恢复逻辑（onModuleInit）

服务启动时，对每条链依次执行：

1. **优先从 Redis 加载**
2. Redis 失败且允许时 → 从文件加载
3. 加载成功后：

   * 清理过期数据
   * 重新生成排行榜

是否允许从 Redis / 文件加载，由以下配置精确控制：

```ts
LOAD_MAP_FROM_CACHE[chain]
LOAD_MAP_FROM_FILE[chain]
```

---

#### 6️⃣ 对外接口能力

* `updateGrTokenSortItems`

  * 由 Task 层调用
  * 将 API 拉取到的新 Token 数据注入热度系统

* `getChainQtHotGrTokenSortList`

  * 提供指定：

    * chain
    * qt（5m / 1h / 6h / 24h）
    * page
  * 返回分页后的排序结果

---

## sort-new（预留）

### 设计意图

`sort-new` 用于实现 **“新 Token 排序”**，与 `sort-hot` 在定位上是并列关系，但逻辑侧重点不同：

* 更强调：

  * 上线时间
  * 新增速度
  * 初始交易行为
* 不以长期热度累计为核心

目前仅保留目录与接口位置，待后续策略成熟后实现。

---

## 设计原则总结

* **排序逻辑集中、状态内聚**
* **不与数据抓取强耦合**
* **内存优先，缓存 / 文件兜底**
* **规则表驱动，而非硬编码**
* **“新Toekn排序”代码未实现，预留接口**

---