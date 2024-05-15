import { ethers } from 'ethers';

export interface ContractResult {
  success: boolean;
  error?: Error | string;
  value: ethers.TransactionResponse;
}
