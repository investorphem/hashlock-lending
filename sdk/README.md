# hashlock-lending-sdk 🔒

**Yield on Bitcoin. Locked by code. Verified by hash.**

The **first developer-ready JavaScript SDK** for interacting with HashLock Lending — the Bitcoin L2 lending protocol powered by Clarity 4.

No admin keys • No upgrades • No trust assumptions • Verified vaults

---

## Installation

```bash
npm install hashlock-lending-sdk
```

or

```bash
yarn add hashlock-lending-sdk
```

---

## Quick Start

```javascript
const { HashlockClient } = require('hashlock-lending-sdk');

// Initialize client
const client = new HashlockClient({
  network: 'mainnet', // or 'testnet'
  wallet: 'xverse' // optional
});

// Create a new loan
const preimage = "super-secret";
const loanId = await client.createLoan({
  borrower: "SP123...",
  lender: "SP456...",
  amount: 1000,
  preimage
});

// Repay a loan
await client.repayLoan(loanId, preimage);

// Check loan status
const status = await client.getLoanStatus(loanId);
console.log(status);
```

---

## Core Features

| Feature | hashlock-lending-sdk | Other Lending Protocols |
|---------|--------------------|-----------------------|
| On-chain code hash verification | ✅ `contract-hash?` enforced on every deposit | ❌ None |
| Auto-revert rogue transfers | ✅ `restrict-assets?` post-conditions | ❌ Admin keys only |
| Immutable vaults | ✅ Pure templates | ❌ Proxy upgrades required |
| Admin keys | ✅ None | ❌ Always present |
| Clarity version | ✅ 4 | ❌ 2/3 |

---

## Live Contracts (Stacks Mainnet)

| Contract | Purpose | Address |
|----------|---------|---------|
| `hashlock-core` | Lending pool + template registry | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-core` |
| `hashlock-isolated-sbtc-v1` | First whitelisted vault (sBTC flash loans) | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-isolated-sbtc-v1` |
| `safe-vault-base` | Shared immutable safety traits | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.safe-vault-base` |

---

## Developer Guide

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/hashlock-lending.git
cd hashlock-lending/sdk
```

### 2. Verify Contracts (optional)

```bash
clarinet check      # Verify Clarity 4 syntax
clarinet test       # Run unit tests
```

### 3. Deploy (optional)

```bash
clarinet deploy --mainnet
```

### 4. Use the SDK

```javascript
import { HashlockClient } from 'hashlock-lending-sdk';
```

---

## Tech Stack

- **Smart Contracts:** Clarity 4 on Stacks (Bitcoin-secured via PoX + sBTC)  
- **Frontend:** React + Vite + @stacks/connect (Leather/Xverse)  
- **Hosting:** Vercel (zero-config)  
- **Supported Assets:** sBTC (mainnet), xBTC, USDA, stSTX coming  

---

## Resources

- **App:** [hashlocklending.vercel.app](https://hashlocklending.vercel.app)  
- **Explorer:** [Hiro Explorer](https://explorer.hiro.so/address/SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR)  
- **Twitter:** [@YourTwitterHandle](https://twitter.com/YourTwitterHandle)