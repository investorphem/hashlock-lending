# @investorphem/hashlock-sdk

The official TypeScript SDK for the **HashLock Lending Protocol** on the Stacks Mainnet. Built and maintained by Masonode Technologies Limited.

## 📦 Installation

Install the SDK along with its required peer dependencies using npm:

```bash
npm install @masonode/hashlock-sdk @stacks/transactions @stacks/network

🚀 Quick Start
Initialize the client and read the live protocol parameters from the Stacks Mainnet:

import { HashLockClient } from '@masonode/hashlock-sdk';

// Initializes with connection to the premium Hiro Mainnet API node
const client = new HashLockClient();

async function getProtocolState() {
  try {
    const reserve = await client.getVaultReserve();
    console.log(`Current HashLock Vault Reserve: ${reserve} u-sBTC`);
  } catch (error) {
    console.error("Failed to read protocol state:", error);
  }
}

getProtocolState();
