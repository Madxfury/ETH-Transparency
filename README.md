# ETH TRANSPARENCY — Ethereum Blockchain Observatory

> **Experiment:** Demonstrating Transparency and Pseudo-Anonymity Properties of Blockchain

A production-grade, real-time Ethereum Mainnet observability web application engineered to visually demonstrate the core properties of public distributed ledgers: **complete transactional transparency** paired with **cryptographic pseudonymity**.

---

## 🌟 Core Objective & Scientific Rationale

Every Ethereum transaction is publicly observable across global validating nodes. This observatory ingests real-time blocks from Ethereum Mainnet via JSON-RPC, decoding transaction inputs, values, gas economics, and addresses without any fabricated data.

### Key Demonstrations:
1. **Public Transparency**:
   - Every transaction hash, block number, exact ETH/Wei value, sender address, receiver address, and gas fee is 100% public and auditable.
2. **Pseudo-Anonymity**:
   - Entities are represented exclusively by 20-byte hexadecimal public addresses (`0x...`). No names, government IDs, IP addresses, or emails exist on-chain.
3. **Behavioral Correlation**:
   - When an address transacts repeatedly, the dashboard detects and clusters these actions in real-time, demonstrating how temporal heuristics and transaction graph analysis can correlate pseudonymous entities.

---

## ✨ Features

- **Live Ethereum Stream**: Continuous real-time block and transaction ingestion directly from Ethereum Mainnet.
- **Dynamic Network Statistics**: Live tickers for latest block, observed transaction volume, cumulative ETH transfers, active unique wallets, and base gas fees.
- **Transaction Detail Slide-Over**: In-depth EVM inspection of hashes, nonces, calldata payloads, gas metrics, and direct links to Etherscan.
- **Wallet Activity Tracker**: Query any Ethereum address to view live on-chain balance, lifetime nonce, session transaction history (SENT vs RECEIVED), and counterparty connections.
- **Multiple Transaction Correlation**: Automated detection of recurring wallets across the session stream with expandable trace breakdowns.
- **Interactive Force-Directed Network Graph**: Interactive D3-powered network visualization mapping wallets (nodes) and transfers (directional edges) with drag, zoom, and node inspection.
- **Transparency vs. Pseudo-Anonymity Matrix**: Technical side-by-side comparison of on-chain ledger visibility vs cryptographic identity bounds.
- **Experiment Telemetry Export**: Download full session experiment metrics and transaction data as JSON for academic reports.
- **Multi-RPC Failover**: Zero-configuration default connectivity (LlamaRPC, PublicNode, Ankr, 1RPC, Cloudflare) + custom RPC endpoint manager.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Blockchain Ingestion**: `viem` (Type-safe Ethereum JSON-RPC client)
- **Visualization**: D3.js force simulation (`d3-force`, `d3-zoom`)
- **Telemetry**: Canvas Confetti, JSON Exporter

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
If you want to use a private Alchemy, Infura, or QuickNode RPC endpoint:
```bash
cp .env.example .env
```
Edit `.env`:
```env
VITE_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
```
*(If left blank, the app will automatically use high-availability public RPCs).*

### 3. Run Locally
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 Privacy & Educational Disclaimer

This dashboard strictly monitors publicly broadcast data on Ethereum Mainnet. Wallet addresses are pseudonymous identifiers and should not be assumed to correspond to real-world identities.

---

Made with ❤️‍🔥 by **SANSKAR**
