# HashLock Lending 🔒

**Yield on Bitcoin. Locked by code. Verified by hash.**

The world’s first lending protocol that **cryptographically guarantees** every vault is an exact, audited, immutable template — powered by Clarity 4’s `contract-hash?` and `restrict-assets?`.

No admin keys • No upgrades • No trust assumptions  
If the bytecode doesn’t match the whitelisted hash → funds cannot enter.

**Live on Stacks Mainnet (Bitcoin L2) — December 2025**

**App:** https:  
**Frontend:** [https://hashlocklending.vercel.app](https://hashlocklending.vercel.app)  
**Explorer:** [Hiro Explorer](https://explorer.hiro.so/address/SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR)  
**Twitter:** [@YourTwitterHandle](https://twitter.com/YourTwitterHandle)

---

## 📦 NPM SDK

Install the official JavaScript SDK for developers:

```bash
npm install hashlock-lending-sdk
```

```javascript
// Example usage
const { HashlockClient } = require('hashlock-lending-sdk');

async function main() {
  const client = new HashlockClient({ network: "mainnet", walletType: "xverse" });

  // Connect wallet
  await client.connectWallet({ appName: "HashLock SDK Demo" });

  // Create a loan
  const loanId = await client.createLoan({
    loanId: "loan1",
    borrower: "SP123...",
    lender: "SP456...",
    amount: 1000,
    preimage: "super-secret"
  });

  console.log("Loan created:", await client.getLoanStatus(loanId));

  // Repay the loan
  await client.repayLoan(loanId, "super-secret");
  console.log("Loan repaid:", await client.getLoanStatus(loanId));
}

main();
```

---

## Core Innovation (Clarity 4 Exclusive)

| Feature                        | HashLock Lending                          | Everyone Else (Aave, Compound, Alex, etc.) |
|--------------------------------|------------------------------------------|---------------------------------------------|
| On-chain code hash verification | `contract-hash?` enforced on every deposit | ❌ None                                      |
| Auto-revert rogue transfers     | `restrict-assets?` post-conditions       | ❌ Only admin keys                           |
| Immutable vaults                | Yes — pure templates                      | ❌ Proxy upgrades                            |
| Admin keys                      | Zero                                      | Always present                              |
| Clarity version                 | Clarity 4 (mainnet live Dec 2025)        | Clarity 2/3                                 |
| Wallet Integration              | ✅ Xverse / Leather                        | ❌ None                                      |

---

## Live Contracts (Stacks Mainnet)

| Contract                      | Purpose                                  | Address |
|--------------------------------|----------------------------------------|-----------------------------------------------------|
| `hashlock-core`               | Lending pool + template registry        | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-core` |
| `hashlock-isolated-sbtc-v1`   | First whitelisted vault (sBTC flash loans) | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-isolated-sbtc-v1` |
| `safe-vault-base`             | Shared immutable safety traits          | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.safe-vault-base` |

---

## Tech Stack

- **Smart Contracts:** Clarity 4 on Stacks (Bitcoin-secured via PoX + sBTC)  
- **Frontend:** React + Vite + @stacks/connect (Leather/Xverse)  
- **Hosting:** Vercel (zero-config)  
- **Assets Supported:** sBTC (mainnet), xBTC, USDA, stSTX coming  

---

## Quick Start (Developers)

```bash
git clone https://github.com/yourusername/hashlock-lending.git
cd hashlock-lending

# Verify Clarity 4 syntax
clarinet check

# Run unit tests
clarinet test

# Deploy your own instance
clarinet deploy --mainnet
```

---

## Resources

- **SDK Documentation:** [NPM Package](https://www.npmjs.com/package/hashlock-lending-sdk)  
- **App:** [https://hashlocklending.vercel.app](https://hashlocklending.vercel.app)  
- **Explorer:** [Hiro Explorer](https://explorer.hiro.so/address/SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR)  
- **Twitter:** [@investorphem](https://twitter.com/investorphem)