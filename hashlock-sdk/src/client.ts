// ==========================================
// HASHLOCK SDK: CORE CLIENT
// ==========================================

import { StacksMainnet } from '@stacks/network';
import { 
  callReadOnlyFunction, 
  makeContractCall,
  uintCV, 
  cvToValue
} from '@stacks/transactions';
import { CONTRACTS, MAINNET_DEPLOYER } from './constants';
import { DepositOptions, WithdrawOptions } from './types';

export class HashLockClient {
  private network: StacksMainnet;

  constructor() {
    // Hardcoded to premium Hiro API for Masonode Mainnet routing
    this.network = new StacksMainnet({ url: 'https://api.hiro.so' });
  }

  /**
   * Retrieves the current reserve balance of the standard vault.
   * Does not require a wallet connection (Read-Only).
   */
  async getVaultReserve(): Promise<number> {
    const [contractAddress, contractName] = CONTRACTS.VAULT.split('.');
    
    const result = await callReadOnlyFunction({
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
   * This object can be passed directly to the Stacks Web Wallet or Mobile App.
   */
  async buildDepositTx(options: DepositOptions) {
    const [contractAddress, contractName] = CONTRACTS.VAULT.split('.');

    return makeContractCall({
      contractAddress,
      contractName,
      functionName: 'deposit',
      functionArgs: [uintCV(options.amount)],
      network: this.network,
      senderAddress: options.senderAddress,
    });
  }

  /**
   * Builds the transaction payload for withdrawing sBTC.
   */
  async buildWithdrawTx(options: WithdrawOptions) {
    const [contractAddress, contractName] = CONTRACTS.VAULT.split('.');

    return makeContractCall({
      contractAddress,
      contractName,
      functionName: 'withdraw',
      functionArgs: [uintCV(options.amount)],
      network: this.network,
      senderAddress: options.senderAddress,
    });
  }
}
