<p align="left">
  语言切换
</p>

<p align="left">
  <a href="./README.md">English</a> | 
  <a href="./README.zh-CN.md">中文</a>
</p>

<p align="left">
  <!-- Core Framework -->
  <img src="https://img.shields.io/badge/Next.js-Frontend-black?logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Redux-Toolkit-purple?logo=redux" />
</p>

<p align="left">
  <!-- UI / Styling -->
  <img src="https://img.shields.io/badge/TailwindCSS-UI-38B2AC?logo=tailwind-css" />
  <img src="https://img.shields.io/badge/DaisyUI-Components-5A0EF8" />
  <img src="https://img.shields.io/badge/Radix_UI-Unstyled-black" />
  <img src="https://img.shields.io/badge/TradingView-Chart-blue" />
</p>

---  

关键词：**Web3 Token 实时行情分析平台 (Next.js + TypeScript)**

技术栈：Next.js · React · TypeScript · Redux Toolkit · TailwindCSS · DaisyUI

---

## 第一部分：Next.js 项目介绍

这是一个基于 **Next.js + TypeScript + Redux Toolkit** 构建的  
**Web3 Token 实时数据分析前端系统**。

该前端系统用于展示多链 Token 的实时交易数据、K线图与排行榜信息。

### 已实现功能

- 多链 Token 实时行情展示
- Token 热度排行榜
- Token K线图（第三方付费 K 线组件 / lightweight-charts 免费版）
- Token 收藏与分组管理
- Pump 页面：新币对 / 即将迁移 / 已迁移
- 支持多语言与主题切换


### 计划实现功能

1️⃣ 已实现界面及接口定义，但未实现后端逻辑

- Token 新币排行榜
- Token 自定义数据筛选（已完成筛选界面，后端数据过滤尚未实现）
- 按 合约地址 / 币名 进行多链查找

2️⃣ 后续计划实现功能
- 钱包的链接 / 授权交易
- 用户邀请统计
- 交易返佣
- 用户盈亏统计

### 性能优化

- Token 列表 **分页控制渲染数量**（每页约 30–40 条）
- 实时数据 **局部组件刷新**，减少整体重渲染

---

## 第二部分：技术栈

| 技术 | 说明 |
|-----|------|
| Next.js | React 全栈框架 |
| TypeScript | 类型安全 |
| Redux Toolkit | 全局状态管理 |
| TailwindCSS | UI 样式 |
| DaisyUI | 组件风格系统 |
| Radix UI | 无样式组件库 |
| TradingView Chart | K线图 |

---
## 第三部分：演示视频

完整演示视频见：

[monorepo README]

## 第四部分：核心功能

### 1. 实时 Token 排行系统

- Token 热度、新币排行
- 实时成交额统计
- 多周期数据分析

---

### 2. 多维度 Token 数据展示

支持展示：

- 市值 (Market Cap)
- 流动性 (Liquidity)
- 交易地址数
- 成交额
- 持有人数量
- 涨跌幅

---

### 3. 用户偏好管理

项目使用 **Redux Toolkit** 管理用户界面偏好，以下功能：

- UI 主题（Theme）
- 语言设置（Language）
- Token 收藏及收藏分组

用户偏好会同步持久化到 localStorage，确保刷新页面后仍保持当前配置。

技术实现：

- Redux Toolkit Slice 管理 UI 状态
- localStorage 持久化用户偏好

---
### 4. Token K 线图表分析

- 默认使用：付费版的Moralis K线组件（基于 TradingView 专业版组件的二次封装）   
- 可选使用： TradingView Lightweight Charts（免费）
- 可选使用： 上线后申请：TradingView 专业K 线组件 （付费授权）

---


## 第五部分：仓库结构

项目采用 **模块化组件设计 + 状态管理分层结构**：

```

src
├─ app
├─ components
│   ├─ Chart
│   ├─ Dialog
│   ├─ Floating
│   └─ TokenTable
├─ store
│   ├─ favoriteTokenSlice
│   ├─ favoriteGroupSlice
│   └─ themeSlice
├─ services
└─ utils

````

---
## 第六部分：修改 .env文件名

**开发环境**

```text
apps\nextjs-frontend\.env.development copy.local
→ apps\nextjs-frontend\.env.development.local
```

**生产环境**

```text
apps\nextjs-frontend\.env.production copy.local
→ apps\nextjs-frontend\.env.production.local
```
---

## 第七部分：配置 .env 和 next.config.ts 环境变量


1️⃣ .env配置文件

```text
apps\nextjs-frontend\.env.development.local   # 开发模式
apps\nextjs-frontend\.env.production.local    # 生产模式
```

主要需要配置以下三项：

1.1 `NEXT_PUBLIC_NEST_API_HOST`

  * NestJS 后端接口地址（含端口）
  * 同一主机可通过端口区分开发 / 生产

1.2 `NEXT_PUBLIC_IMAGE_URL`

  * 用于将远程图片地址映射为本地展示地址

1.3 `NEXT_PUBLIC_TV_CHART_URL`

  * Moralis 版 K 线组件地址
  * 可使用远程或本地
  * 使用前提：**已开通 Moralis Business 会员**

2️⃣ next.config.ts配置文件

NextJs项目运行在AWS（EC2）等服务器时，需修改next.config.ts文件：
```text
apps\nextjs-frontend\next.config.ts
```

```code
remotePatterns: [   
      {
        protocol: 'http',
        hostname: '154.75.45.26',
        port: '',
        pathname: '/**',
      },
],
```
将其中的：hostname: '154.75.45.26'、port: '',  里面ip地址、端口号，改为远程主机的ip地址、端口号

---

## 第八部分：启动项目（Quick Start）

### 一：前置检查工作

注：本项目为 Monorepo 结构。
如未初始化：Monorepo 根项目，请先在仓库根目录安装依赖

```bash
pnpm install
```


### 二：进入前端目录：

```bash
cd apps/nextjs-frontend
```

### 三：运行 Next.js 后端项目

**开发模式**

```bash
pnpm run dev
```

访问开发模式：

```
http://127.0.0.1:4526
```

**生产模式（编译 → 运行）**

```bash
pnpm run build
pnpm run start
```

访问生产模式：

```
http://127.0.0.1:3586
```

---

## 附录：K 线组件说明

本 Next.js 项目引入的是 **Moralis 提供的第三方 K 线组件**，
该组件为 **Moralis 基于 TradingView 的二次封装版本**。

* Moralis K 线组件官方说明：
  [https://moralis.com/crypto-price-chart-widget/?utm_source=docs](https://moralis.com/crypto-price-chart-widget/?utm_source=docs)

* 使用条件：
  **Moralis Business 会员（$490 / 月）**

### 项目中对应实现位置

```text
apps\nextjs-frontend\src\components\Chart\TokenChart\Page.tsx
```

---

### 替代方案（免费 / 轻量）

#### TradingView Lightweight Charts（免费）

* 官方文档：
  [https://www.tradingview.com/lightweight-charts/](https://www.tradingview.com/lightweight-charts/)

* 项目中已实现的免费 K 线组件代码位置：

```text
apps\nextjs-frontend\src\components\Chart\TradingView\CandlestickChart.tsx
```

---

> 若项目正式上线，并且绑定域名，
> 可向 TradingView 申请 **专业付费版 K 线组件** 作为最终方案。

---

## 联系方式

如果您有任何问题、建议或合作想法：

- GitHub: https://github.com/gorank-fullstack
- Telegram: t.me/gorank_fullstack
- Email: gorank1024@gmail.com

---
