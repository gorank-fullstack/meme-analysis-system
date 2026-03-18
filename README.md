# ## Part 1: Monorepo Project Overview

**goRank** is a Web3 token real-time ranking and scoring system built with **NestJS + Next.js**.

> A real-time Web3 token ranking and scoring engine powered by multi-source data aggregation and Redis caching.
> Runtime: Node.js ≥ 18, Redis ≥ 5.0 (see requirements below)

---

### Project Info

* **Name:** goRank
* **Version:** v0.1.3

---

### Key Features

* **Monorepo Architecture**
  Unified management of NestJS backend and Next.js frontend with shared types and consistent engineering structure

* **Modular Design**
  Clean structure for scalability and maintainability

---

### Core Functionality

#### Feature Modules

* Trending & new token rankings across **5m / 1h / 6h / 24h**
* Token analysis:

  * Contract security
  * Liquidity safety checks
* Pump tracking:

  * New pairs
  * Upcoming migrations
  * Completed migrations
* Anti-bot filtered ranking & token scoring system

---

#### Multi-chain Support

* **EVM:** eth / bsc / base / arb
* **SPL:** sol
* **Move:** sui / aptos
* **30+ supported blockchains**

---

> ⚠️ **Note:** The anti-bot ranking logic and token scoring algorithm are not open-sourced in this version. Only interface definitions are provided.

---

# ## Part 2: Tech Stack

### Frontend (Next.js)

```text
- UI / Styling:
  - Tailwind CSS
  - DaisyUI
  - Radix UI
  - sonner

- State Management:
  - Redux Toolkit
  - localStorage
```

---

### Backend (NestJS)

```text
- Cache:
  - Redis

- Third-party APIs:
  - solscan.io
  - moralis.com
  - geckoterminal.com
  - gopluslabs.io
```

---

# ## Part 3: System Architecture

```text
Data Flow:

[Third-party APIs]
        ↓
------------------------------
 Data Collection Layer
------------------------------
[Data Collector Layer]
        ↓
------------------------------
 Data Processing Layer
------------------------------
[Unified Data Processing]
[Token Scoring Engine]
        ↓
------------------------------
 Cache Layer
------------------------------
[Redis Ranking Cache]
        ↓
------------------------------
 Service Layer
------------------------------
[Backend API (NestJS)]
        ↓
------------------------------
 Presentation Layer
------------------------------
[Frontend (Next.js)]
        ↓
[User Interaction]
```

---

# ## Part 4: Demo

### 1. NestJS Backend – Runtime Output

**Demo Content:**

* Running NestJS backend in terminal (via VS Code)

<p align="center">
Click the image to watch the full demo:
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=YUcUKd-RIAk">
    <img src="https://img.youtube.com/vi/YUcUKd-RIAk/maxresdefault.jpg" width="600">
  </a>
</p>

---

### 2. Next.js Frontend – Features & UI

#### 2.1 Token List & Interactions

**Demo Content:**

* Token favorites
* Favorite grouping
* Pagination
* Sorting
* Hover info card:

  * Token summary
  * Mini K-line chart
* Feedback notifications:

  * Success / Error / Warning

<p align="center">
Click the image to watch the full demo:
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=EZcm4neH5PU">
    <img src="https://img.youtube.com/vi/EZcm4neH5PU/maxresdefault.jpg" width="600">
  </a>
</p>

---

#### 2.2 Token Detail & Pump Page

**Token Detail Page:**

* Basic token info
* K-line chart
* Trading activity
* Holder addresses
* Holder analytics

**Pump Page:**

* New pairs
* Upcoming launches
* Launched tokens

<p align="center">
Click the image to watch the full demo:
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=UVPEXwAX9vg">
    <img src="https://img.youtube.com/vi/UVPEXwAX9vg/maxresdefault.jpg" width="600">
  </a>
</p>

---

# ## Part 5: Repository Structure

### Overview

```text
apps/
├─ nestjs-backend/      # NestJS backend service
└─ nextjs-frontend/     # Next.js frontend application
interface/              # Shared types and constants
```

---

### README Navigation

```text
root
│
├ README.md                Project entry
│
├ apps
│   ├ nestjs-backend
│   │   └ README.md        Redis / APIs / env / build & run
│   │
│   └ nextjs-frontend
│       └ README.md        Frontend env / build & run
│
└ interface
    └ README.md            Shared data structures
```

---

> This project includes:

* Root README
* Subproject READMEs (nestjs / nextjs / interface)
* Additional module-level READMEs inside backend

---

# ## Part 6: Requirements

* OS: Linux / Windows
* Redis ≥ 5.0
* Node.js ≥ 18
* Package Manager: pnpm

---

# ## Part 7: Setup

Install dependencies at the root:

```bash
pnpm install
```

---

# ## Appendix: Dev & Debug Tools (Optional)

### Browser Extensions

**React Developer Tools**

* Inspect React component tree & state

**Redux DevTools**

* Track Redux state changes

**FeHelper**

* JSON formatting & structure visualization

---

### API & Data Tools

**Apifox**

* API testing and debugging

**Windows + VPN Issue**

If you encounter:

```text
Client network socket disconnected before secure TLS connection was established
```

**Solution:**

* Path: Settings → Network Proxy → Proxy Mode
* Set:

  * Mode: Custom
  * IP: `127.0.0.1`
  * Port: `7890`

---

**Redis Insight**

* Official Redis GUI tool
* View keys, TTL, and data structures

---

# ## Contact

If you have any questions or collaboration ideas:

* GitHub: [https://github.com/gorank-fullstack](https://github.com/gorank-fullstack)
* Telegram: [t.me/gorank_fullstack](t.me/gorank_fullstack)
* Email: [gorank1024@gmail.com](mailto:gorank1024@gmail.com)

---
