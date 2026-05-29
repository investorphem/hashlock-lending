// ==========================================
// HASHLOCK SDK: CORE CLIENT (V7 COMPATIBLE)
// ==========================================

import { STACKS_MAINNET } from '@stacks/network';
import { 
  fetchCallReadOnlyFunction, 
  uintCV, 
  cvToValue
} from '@stacks/transactions';
import { CONTRACTS, MAINNET_DEPLOYER } from './constants';
import { DepositOptions, WithdrawOptions } from './types';

export class HashLockClient {
  private network = STACKS_MAINNET;

  /**
   * Retrieves the current reserve balance of the standard vault.
   * Does not require a wallet connection (Read-Only).
   */
  async getVaultReserve(): Promise<number> {
    const [contractAddress, contractName] = CONTRACTS.VAULT.split('.');
    
    const result = await fetchCallReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-reserve',
      functionArgs: [],
      network: this.network,
      senderAddress: MAINNET_DEPLOYER,
    });

    return cvToValue(result).value;
  }

  /**
   * Builds the transaction payload for depositing sBTC.
   * This object can be passed directly to @stacks/connect (openContractCall).
   */
  buildDepositTx(options: DepositOptions) {
    const [contractAddress, contractName] = CONTRACTS.VAULT.split('.');

    return {
      contractAddress,
      contractName,
      functionName: 'deposit',
      functionArgs: [uintCV(options.amount)],
      network: this.network,
      stxAddress: options.senderAddress, // Hints the wallet to use this address
    };
  }

  /**
   * Builds the transaction payload for withdrawing sBTC.
   */
  buildWithdrawTx(options: WithdrawOptions) {
    const [contractAddress, contractName] = CONTRACTS.VAULT.split('.');

    return {
      contractAddress,
      contractName,
      functionName: 'withdraw',
      functionArgs: [uintCV(options.amount)],
      network: this.network,
      stxAddress: options.senderAddress,
    };
  }
}
