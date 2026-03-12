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

## Quick Start (with Wallet Integration)

```javascript
const { HashlockClient } = require('hashlock-lending-sdk');

async function main() {
  // Initialize SDK with Xverse wallet on mainnet
  const client = new HashlockClient({ network: "mainnet", walletType: "xverse" });

  // Connect wallet
  await client.connectWallet({ appName: "HashLock SDK Demo" });

  // Create a new loan
  const loanId = await client.createLoan({
    loanId: "loan1",
    borrower: "SP123...",
    lender: "SP456...",
    amount: 1000,
    preimage: "super-secret"
  });

  console.log("Loan created:", await client.getLoanStatus(loanId));

  // Repay loan
  await client.repayLoan(loanId, "super-secret");
  console.log("Loan repaid:", await client.getLoanStatus(loanId));

  // Send STX tokens (optional)
  // await client.sendSTX({ recipient: "SP789...", amount: 1000 });
}

main();
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
| Wallet Integration | ✅ Xverse / Leather | ❌ None |

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

### 2. Install Dependencies

```bash
npm install
```

### 3. Connect Wallet (Xverse or Leather)

```javascript
await client.connectWallet({ appName: "Your App Name" });
```

### 4. Create & Repay Loans

Use `createLoan`, `repayLoan`, and `getLoanStatus` methods as shown in the Quick Start.

### 5. Call Clarity Contracts

- `callReadOnly` → for read-only contract functions  
- `callPublicFunction` → for on-chain function calls

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