## 第一部分：Monorepo 项目介绍

goRank 是一个基于 NestJS + Next.js 构建的 Web3 Token 实时排名与评分系统

> A real-time Web3 token ranking and scoring engine powered by multi-source data aggregation and Redis caching.
> 运行环境：Node.js ≥ 18，Redis ≥ 5.0（详见后文运行要求）

### 项目信息

- **Name:** goRank
- **Version:** v0.1.3

### 项目特点

- Monorepo 架构：统一管理 NestJS 后端与 Next.js 前端，实现类型共享与工程一致性  
- 模块化设计：结构清晰，便于扩展与维护  

### 主要功能

#### 功能模块

- 5m / 1h / 6h / 24h 时间范围的 **热度排行、新币排行**
- Token：合约、流动性安全检测；
- Pump：新币对、即将迁移、已迁移；
- 排除刷量后的热度排序、Token评分

#### 多链支持

- **EVM**：eth / bsc / base / arb  
- **SPL**：sol  
- **Move**：sui / aptos  
- **支持 30+ 条区块链**

---

> ⚠️ 注：**排除刷量后的热度排序与 Token评分算法在此版本中不对外开源，仅保留接口定义。**
---

## 第二部分：技术栈

### 前端技术栈（Next.js）

```text
- UI / 样式组件库：
  - Tailwind CSS
  - DaisyUI
  - Radix UI
  - sonner

- 状态管理 / 存储：
  - Redux-Toolkit
  - localStorage
```

### 后端技术栈（NestJS）

```text
- 缓存：
  - Redis

- 第三方 API：
  - solscan.io
  - moralis.com
  - geckoterminal.com
  - gopluslabs.io

```
---
## 第三部分：系统架构

数据流：

[第三方 API 数据源]
        ↓
------------------------------
 数据采集层
------------------------------
[数据采集模块]
        ↓
------------------------------
 数据处理层
------------------------------
[统一数据处理]
[Token 评分引擎]
        ↓
------------------------------
 缓存层
------------------------------
[Redis 排名缓存]
        ↓
------------------------------
 服务层
------------------------------
[后端 API（NestJS）]
        ↓
------------------------------
 展示层
------------------------------
[前端应用（Next.js）]
        ↓
[用户交互]

## 第四部分：演示视频（Demo）

###  一、NestJS 后端--运行输出演示

演示内容：
- 在 VS Code 中运行 NestJS 后端控制台输出信息

<p align="center">
点击图片观看完整演示视频：
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=YUcUKd-RIAk">
    <img src="https://img.youtube.com/vi/YUcUKd-RIAk/maxresdefault.jpg" width="600">
  </a>
</p>

###  二、Next.js 前端--功能及界面演示

1️⃣ Token列表与交互功能

演示内容：

- Token 收藏
- 收藏分组
- 列表分页
- 数据排序
- 悬浮信息卡片
  - Token简略信息
  - 缩略 K 线图
- 操作反馈提示栏
  - 成功 / 失败 / 警告 提示

<p align="center">
点击图片观看完整演示视频：
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=EZcm4neH5PU">
    <img src="https://img.youtube.com/vi/EZcm4neH5PU/maxresdefault.jpg" width="600">
  </a>
</p>

2️⃣ Token详情及Pump页面

2.1 Token详情页

- Token 基础信息
- K 线图
- 交易活动
- 持币地址
- 持币分析

2.2 Pump 页面
- 新币对
- 即将发射
- 已发射

<p align="center">
点击图片观看完整演示视频：
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=UVPEXwAX9vg">
    <img src="https://img.youtube.com/vi/UVPEXwAX9vg/maxresdefault.jpg" width="600">
  </a>
</p>


---

## 第五部分：仓库结构

### 一、仓库结构总览

```text
apps/
├─ nestjs-backend/      # NestJS 后端服务
└─ nextjs-frontend/     # Next.js 前端应用程序
interface/		# 前后端共享接口与常量

```

---

### 二、分层 README 导航

```text

root
│
├ README.md                项目入口
│
├ apps
│   ├ nestjs-backend
│   │   └ README.md        Redis / 第三方 API / 后端 env / 编译和运行
│   │
│   └ nextjs-frontend
│       └ README.md        前端 env / 编译和运行
│
└ interface
    └ README.md            前后端共用数据结构

```

---
注：此项目包括：根readme文件，及：nestjs、nextjs、interface，三个子项目readme文件；
其中：nestjs后端项目，几个关键模块还包括：readme文件。

---

## 第六部分：运行要求

- 操作系统：Linux / Windows  
- Redis ≥ 5.0  
- Node.js ≥ 18  
- 包管理器：pnpm  

---

## 第七部分：初始化Monorepo 项目

安装 Monorepo 项目依赖

在项目根目录下执行：

```bash
pnpm install
```

---

## 附录：开发 / 调试工具（可选安装）

### 一、浏览器插件

1️⃣ React Developer Tools

* 类型：Chrome 插件
* 功能：React 组件结构与状态调试

2️⃣ Redux DevTools

* 类型：Chrome 插件
* 功能：Redux 状态变化追踪与调试

3️⃣ FeHelper（前端助手）

* 类型：Chrome 插件
* 功能：

  * JSON 自动格式化
  * 支持排序与结构化查看

---

### 二、接口与数据调试工具

1️⃣ Apifox

* 类型：API 请求测试工具
* 功能：接口请求与数据调试

**Windows + VPN 网络环境说明**

在 Windows 本机（127.0.0.1）开启 VPN 后，
若使用 Apifox 请求 API 出现以下错误：

```text
Client network socket disconnected before secure TLS connection was established
```

解决方式：

* Apifox 设置路径：
  **设置 → 网络代理 → 代理模式**
* 代理模式设置为：

  * 模式：自定义
  * IP：`127.0.0.1`
  * 端口：`7890`

---

2️⃣ Redis Insight

* 类型：Redis 官方可视化工具
* 功能：
  * 查看开发 / 生产环境 Redis 数据
  * 调试 Key、TTL、结构与内容
---

## 联系方式

如果您有任何问题、建议或合作想法：

- GitHub: https://github.com/gorank-fullstack
- Telegram: t.me/gorank_fullstack
- Email: gorank1024@gmail.com

---