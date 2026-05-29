import { StacksMainnet } from '@stacks/network';
import { 
  callReadOnlyFunction, 
  makeContractCall,
  uintCV, 
  principalCV,
  cvToValue
} from '@stacks/transactions';
import { CONTRACTS, MAINNET_DEPLOYER } from './constants';

export class HashLockClient {
  private network: StacksMainnet;

  constructor() {
    this.network = new StacksMainnet({ url: 'https://api.hiro.so' });
  }

  /**
   * Read-only: Get the current reserve balance of a specific vault
   */
  async getVaultReserve(): Promise<number> {
    const [contractAddress, contractName] = CONTRACTS.VAULT.split('.');
    
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-reserve',
      functionArgs: [],
      network: this.network,
      senderAddress: MAINNET_DEPLOYER, // Default fallback reader
    });

    // Parse the Clarity response object
    return cvToValue(result).value;
  }

  /**
   * Tx Builder: Deposit sBTC into the vault
   * Returns the unsigned/pre-signed transaction object ready for a wallet extension
   */
  async buildDepositTx(amount: number, senderAddress: string) {
    const [contractAddress, contractName] = CONTRACTS.VAULT.split('.');

    return makeContractCall({
      contractAddress,
      contractName,
      functionName: 'deposit',
      functionArgs: [uintCV(amount)],
      network: this.network,
      senderAddress,
    });
  }
}
