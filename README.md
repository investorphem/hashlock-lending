# HashLock Lending 🔒

**Yield on Bitcoin. Locked by code. Verified by hash.**

The world’s first lending protocol that **cryptographically guarantees** every vault is an exact, audited, immutable template — powered by Clarity 4’s `contract-hash?` and `restrict-assets?`.

No admin keys • No upgrades • No trust assumptions  
If the bytecode doesn’t match the whitelisted hash → funds cannot enter.

**Live on Stacks Mainnet (Bitcoin L2) — December 2025**

**App:** https://hashlock.fi  
**Frontend:** https://hashlock-lending.vercel.app  
**Explorer:** https://explorer.hiro.so/address/SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR  
**Twitter:** @hashlock_xyz

### Core Innovation (Clarity 4 Exclusive)

| Feature                      | HashLock Lending                          | Everyone Else (Aave, Compound, Alex, etc.) |
|------------------------------|-------------------------------------------|---------------------------------------------|
| On-chain code hash verification | `contract-hash?` enforced on every deposit | ❌ None                                      |
| Auto-revert rogue transfers   | `restrict-assets?` post-conditions        | ❌ Only admin keys                           |
| Immutable vaults              | Yes — pure templates                      | ❌ Proxy upgrades                            |
| Admin keys                    | Zero                                      | Always present                              |
| Clarity version               | Clarity 4 (mainnet live Dec 2025)         | Clarity 2/3                                 |

### Live Contracts (Stacks Mainnet)

| Contract                        | Purpose                                  | Address |
|---------------------------------|------------------------------------------|-----------------------------------------------------|
| `hashlock-core`                 | Lending pool + template registry         | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-core` |
| `hashlock-isolated-sbtc-v1`     | First whitelisted vault (sBTC flash loans) | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.hashlock-isolated-sbtc-v1` |
| `safe-vault-base`               | Shared immutable safety traits           | `SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.safe-vault-base` |

### Tech Stack

- **Smart Contracts:** Clarity 4 on Stacks (Bitcoin-secured via PoX + sBTC)
- **Frontend:** React + Vite + @stacks/connect (Leather/Xverse)
- **Hosting:** Vercel (zero-config)
- **Assets Supported:** sBTC (mainnet), xBTC, USDA, stSTX coming

### Quick Start (Developers)

```bash
git clone https://github.com/yourusername/hashlock-lending.git
cd hashlock-lending

clarinet check          # Verify Clarity 4 syntax
clarinet test           # Run unit tests
clarinet deploy --mainnet   # Deploy your own instance