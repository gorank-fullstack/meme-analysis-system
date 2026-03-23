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

# **Web3 Token Real-Time Analytics Platform (Next.js + TypeScript)**

**Tech Stack:** Next.js · React · TypeScript · Redux Toolkit · TailwindCSS · DaisyUI

---

## Part 1: Next.js Project Overview

This is a frontend system built with **Next.js + TypeScript + Redux Toolkit**, designed for **real-time Web3 token data analytics**.

The application focuses on visualizing **multi-chain token trading data**, including charts, rankings, and user interactions.

### Implemented Features

* Real-time multi-chain token market data display
* Token popularity ranking system
* Token candlestick charts (paid third-party / lightweight-charts free version)
* Token favorites and grouping management
* Pump page:

  * New pairs
  * Migrating tokens
  * Migrated tokens
* Multi-language support and theme switching

---

### Planned Features

#### 1️⃣ UI & API defined (backend logic pending)

* New token ranking
* Custom token filtering
  (UI completed, backend filtering not implemented yet)
* Multi-chain search by:

  * Contract address
  * Token name

#### 2️⃣ Future Roadmap

* Wallet connection & transaction authorization
* User invitation tracking
* Trading commission system
* User profit & loss analytics

---

### Performance Optimization

* Token list uses **pagination (30–40 items per page)**
* Real-time updates use **partial component refresh**, reducing full re-renders

---

## Part 2: Tech Stack

| Technology        | Description                |
| ----------------- | -------------------------- |
| Next.js           | Full-stack React framework |
| TypeScript        | Type safety                |
| Redux Toolkit     | Global state management    |
| TailwindCSS       | Utility-first styling      |
| DaisyUI           | Component design system    |
| Radix UI          | Headless UI components     |
| TradingView Chart | Candlestick chart          |

---

## Part 3: Demo Video

Full demo video:

[See monorepo README]

---

## Part 4: Core Features

### 1. Real-Time Token Ranking System

* Token popularity & new token rankings
* Real-time trading volume tracking
* Multi-timeframe data analysis

---

### 2. Multi-Dimensional Token Data Display

Supports:

* Market Cap
* Liquidity
* Number of traders
* Trading volume
* Holder count
* Price change (%)

---

### 3. User Preference Management

The project uses **Redux Toolkit** to manage UI-related user preferences:

* UI Theme
* Language settings
* Token favorites & grouping

User preferences are persisted in **localStorage**, ensuring consistency after page refresh.

**Technical Implementation:**

* Redux Toolkit slices for UI state
* localStorage persistence

---

### 4. Token Candlestick Chart Analysis

* Default: **Moralis paid chart widget**
  (based on TradingView advanced chart, wrapped by Moralis)

* Optional:

  * TradingView Lightweight Charts (free)
  * TradingView Advanced Chart (paid, official license required)

---

## Part 5: Project Structure

The project follows a **modular component design + layered state management architecture**:

```text
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
```

---

## Part 6: Rename `.env` Files

**Development**

```text
apps\nextjs-frontend\.env.development copy.local
→ apps\nextjs-frontend\.env.development.local
```

**Production**

```text
apps\nextjs-frontend\.env.production copy.local
→ apps\nextjs-frontend\.env.production.local
```

---

## Part 7: Environment Configuration

### 1️⃣ `.env` Files

```text
apps\nextjs-frontend\.env.development.local
apps\nextjs-frontend\.env.production.local
```

### Required Variables

#### 1.1 `NEXT_PUBLIC_NEST_API_HOST`

* Backend API endpoint (with port)
* Can distinguish dev/prod via port

#### 1.2 `NEXT_PUBLIC_IMAGE_URL`

* Maps remote image URLs to local display paths

#### 1.3 `NEXT_PUBLIC_TV_CHART_URL`

* Moralis chart widget URL
* Supports remote or local deployment
* Requirement: **Moralis Business subscription**

---

### 2️⃣ `next.config.ts`

When deploying on servers (e.g., AWS EC2), update:

```text
apps\nextjs-frontend\next.config.ts
```

```ts
remotePatterns: [
  {
    protocol: 'http',
    hostname: '154.75.45.26',
    port: '',
    pathname: '/**',
  },
],
```

Replace:

* `hostname`
* `port`

with your actual server IP and port.

---

## Part 8: Quick Start

### 1. Prerequisites

This project uses a **Monorepo structure**.

Install dependencies at the root:

```bash
pnpm install
```

---

### 2. Enter Frontend Directory

```bash
cd apps/nextjs-frontend
```

---

### 3. Run the Project

#### Development

```bash
pnpm run dev
```

Access:

```
http://127.0.0.1:4526
```

---

#### Production

```bash
pnpm run build
pnpm run start
```

Access:

```
http://127.0.0.1:3586
```

---

## Appendix: Chart Component Notes

This project integrates a **third-party chart widget provided by Moralis**,
which is a **wrapped version of TradingView advanced charts**.

* Moralis Chart Widget Docs:
  [https://moralis.com/crypto-price-chart-widget/?utm_source=docs](https://moralis.com/crypto-price-chart-widget/?utm_source=docs)

* Requirement:
  **Moralis Business Plan ($490/month)**

---

### Implementation Location

```text
apps\nextjs-frontend\src\components\Chart\TokenChart\Page.tsx
```

---

### Alternative (Free)

#### TradingView Lightweight Charts

* Docs:
  [https://www.tradingview.com/lightweight-charts/](https://www.tradingview.com/lightweight-charts/)

* Implementation:

```text
apps\nextjs-frontend\src\components\Chart\TradingView\CandlestickChart.tsx
```

---

> After production deployment with a domain,
> you can apply for the **official TradingView advanced chart license** as the final solution.

---

## Contact

If you have any questions, suggestions, or collaboration ideas:

* GitHub: [https://github.com/gorank-fullstack](https://github.com/gorank-fullstack)
* Telegram: t.me/gorank_fullstack
* Email: [gorank1024@gmail.com](mailto:gorank1024@gmail.com)

---
