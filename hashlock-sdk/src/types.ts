// ==========================================
// HASHLOCK SDK: TYPE DEFINITIONS
// ==========================================

export interface VaultReserveResponse {
  value: number;
}

export interface DepositOptions {
  amount: number;
  senderAddress: string;
}

export interface WithdrawOptions {
  amount: number;
  senderAddress: string;
}

export interface NetworkConfig {
  env: 'mainnet' | 'testnet' | 'devnet';
}
