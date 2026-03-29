import { AppConfig, UserSession } from '@stacks/connect'
import { StacksMainnet, StacksTestnet } from '@stacks/network'

// ==========================================
// NETWORK CONFIGURATION
// ==========================================
// Centralized network configuration. 
// Swap to `new StacksTestnet()` when doing local testing.
export const network = new StacksMainnet()

// ==========================================
// AUTHENTICATION & SESSION
// ==========================================
// 'store_write' and 'publish_data' permissions are perfect 
// for interacting with your decentralized lending vaults.
const appConfig = new AppConfig(['store_write', 'publish_data'])

export const userSession = new UserSession({ appConfig })
