<p align="left">
  语言
</p>

<p align="left">
  <a href="./README.md">English</a> | 
  <strong>中文</strong>
</p>

---

<p align="left">
  README 导航
</p>

<p align="left">
  <a href="../README.zh-CN.md">root</a> &gt; <strong>interface</strong>
</p>

---

## 1.0 Interface 接口层

本目录用于定义 Meme Analysis System 单体仓库中的 数据契约、接口协议以及公共类型定义。

该层作为系统的 Boundary Layer，用于隔离和规范以下模块之间的数据交互：

1. 外部数据源（链上 / 链下第三方 API）
2. 后端服务（NestJS）
3. 前端消费方（Next.js）

本目录不包含任何业务逻辑实现，仅用于定义：

1. TypeScript 接口（interface / type）
2. 上游 API 数据结构
3. 统一数据格式
4. 公共常量与工具类型

---

## 2.0 目录结构说明

```text
interface/
├─ axios-client/            # 统一封装的 HTTP / Axios 请求客户端
│
├─ interface-api/           # 第三方平台 API 接口定义
│  ├─ platform-data/        # 行情 / 链上数据平台
│  ├─ platform-safe/        # Token 安全与风险检测平台
│  └─ uniform-data/         # 系统统一结构 + API 输出结构定义层
│
├─ interface-base/          # 基础类型定义（链类型、时间窗口等）
│  ├─ chain_api.ts
│  ├─ chain_type.ts         # 链类型定义：SPL / EVM / TVM / FVM / TAO / Move
│  ├─ evm-address.ts        # EVM 链特殊地址定义
│  ├─ gp-common-token-types.ts  # 三态（T3State）定义：-1(未知) / 0(否/安全) / 1(是/风险)
│  └─ platform-types.ts     # 第三方平台类型、默认 ProgramId、SOL_PUMP / SOL_BONK 常量
│
├─ interface-task/          # 定时任务与调度相关接口定义
│  └─ uniform-data/
│
└─ interface-utils/         # 公共工具模块（数学、排序、时间）
   ├─ common.ts
   ├─ math.ts               # 数值处理、百分比转换、四舍五入 / 向下取整
   ├─ sort.ts               # 排序相关
   └─ time.ts               # 时间常量
```

---

## 3.0 axios-client

用于系统内所有后端模块访问外部 HTTP API 的通用网络访问封装。

### 3.1 职责说明

1. Axios 实例的统一创建与配置
2. 默认 timeout / headers 管理
3. 请求与响应拦截器
4. 认证信息（如 Token）的统一注入

### 3.2 设计说明

1. 不包含任何平台相关逻辑
2. 可被多个 API 模块复用

---

## 4.0 interface-api

定义第三方平台的原始 API 数据结构（Raw API Interfaces）。

该层接口严格对应上游接口返回结构，不做统一、不做归一化，主要用于：

1. 描述真实返回字段
2. 作为数据转换与评分逻辑的输入

---
### 4.1 platform-data

行情与链上数据平台的接口定义，目前包含：

1. GeckoTerminal
2. Moralis
3. Solscan

#### 特点说明

1. 尽量贴近上游接口原始字段
2. 不引入业务语义
3. 作为统一数据结构（uniform-data）的数据来源

---

### 4.2 platform-safe

Token 安全检测与风险评估平台的接口定义。

当前主要接入：

GoPlusLabs

#### 使用场景

1. Token 风险识别
2. 高风险资产过滤
3. 排行榜与曝光前的安全筛选

---

### 4.3 uniform-data

定义系统内部统一数据模型，并作为对外 API 的稳定输出契约层（API Contract Layer），供前端直接使用。

#### 设计目的

不同平台的 API 返回结构差异较大，该层用于统一数据模型：

1. 字段稳定
2. 语义一致
3. 适合前端直接消费的格式

#### 主要使用方

1. 前端接口响应
2. 排名与评分结果输出
3. 聚合后的 Token 数据视图

---

## 5.0 interface-base

系统级基础类型定义模块，供所有子系统共享。

主要包含：

1. 链类型定义（EVM / Solana 等）
2. 时间窗口与时间常量
3. 跨模块通用的基础类型

该模块不包含任何平台或业务相关逻辑。

---

## 6.0 interface-task

定时任务（Task）与调度系统相关的类型与结构定义层。

该目录仅用于定义：

1. 定时任务中使用的 Key 类型
2. 分页状态结构
3. 任务初始化所需的只读数据结构

不包含：

1. 数据获取逻辑
2. 数据转换逻辑
3. 排序、评分、计算逻辑

### 6.1 uniform-data

用于定义任务调度场景下的统一 Key 体系与状态结构。

该层主要服务于：

1. 定时任务（Cron / 秒级调度）
2. 多链 × 多榜单 × 多时间窗口的任务分发
3. 排行榜分页状态的统一管理

#### 当前定义内容

1. 链 + 榜单类型 Key（如 trending / new）
2. 链 + 榜单 + 时间粒度的组合 Key
3. 分页状态结构（current_page / max_page）
4. 空数据初始化结构

---

## 7.0 interface-utils

后端通用工具模块，供多个服务复用。

特点：

1. 纯函数（Pure Function）
2. 确定性输出（Deterministic Output）

包含：

1. math.ts   —— 数值计算与精度安全函数
2. sort.ts   —— 排序辅助函数
3. time.ts   —— 时间常量与时间窗口

---

## 8.0 设计原则说明

1. 核心模块仅定义接口与类型
2. 工具模块提供纯函数实现
3. 强类型约束优于隐式约定
4. 明确区分以下数据层级：
   1. 上游原始数据（Raw Data）
   2. 系统统一结构（Uniform Data）
   3. 前端消费结构（View Model）
5.  支持未来扩展与数据源替换

### 8.1 依赖方向约束

为保证接口层结构清晰、可维护，依赖必须保持单向流动：

raw（platform-data / platform-safe）  
→ uniform-data  
→ task / controller  

禁止出现：

1. uniform-data 反向依赖 raw
2. task 直接依赖 raw（绕过 uniform-data）
3. 跨层循环依赖

所有依赖必须自上而下单向流动。

---

## 联系方式

如果您有任何问题、建议或合作想法：

* GitHub: [github.com/yu-moxing](https://github.com/yu-moxing)
* Telegram: [t.me/yu_moxing](https://t.me/yu_moxing)
* Email: [gorank1024@gmail.com](mailto:gorank1024@gmail.com)

---
