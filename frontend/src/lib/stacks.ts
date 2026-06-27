import { AppConfig, UserSession } from '@stacks/connect'
// ==========================================
// NETWORK CONFIGURATIO
// =========================================
// 'store_write' and 'publish_data' permissions are perfect 
// for interacting with your decentralized lending vaults.
const appConfig = new AppConfig(['store_write', 'publish_data'])

export const userSession = new UserSession({ appConfig })