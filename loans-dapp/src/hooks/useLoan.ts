import { ethers } from 'ethers';
import type { MetaMaskInpageProvider } from "@metamask/providers";
import { ContractResult } from "../interfaces/ContractResult";
import LoanCollateralContract from "../contracts/LoanCollateralContract.json";

async function configureContract(ethereum: MetaMaskInpageProvider): Promise<ethers.Contract> {
    if (!ethereum) throw new Error('Ethereum instance not provided');

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(
        LoanCollateralContract.address,
        LoanCollateralContract.abi,
        signer
    );
}

async function executeContractMethod(method: () => Promise<ethers.TransactionResponse>, errorPrefix: string): Promise<ContractResult> {
    try {
        const tx = await method();
        await tx.wait(); // Wait for the transaction to be confirmed on the chain
        return { success: true, value: tx };
    } catch (error) {
        console.error(`${errorPrefix}:`, error);
        throw new Error(`${errorPrefix}: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
}

async function readContractMethod(method: () => Promise<ethers.TransactionResponse>, errorPrefix: string): Promise<ContractResult> {
    try {
        const tx = await method();
        return { success: true, value: tx };
    } catch (error) {
        console.error(`${errorPrefix}:`, error);
        throw new Error(`${errorPrefix}: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
}

export async function requestLoan(ethereum: MetaMaskInpageProvider, amount: string, nftId: string): Promise<ContractResult> {
    const contract = await configureContract(ethereum);
    return executeContractMethod(() => contract.requestLoan(ethers.parseUnits(amount, "ether"), 30, parseInt(nftId)), 'Error requesting loan');
}

export async function repayLoan(ethereum: MetaMaskInpageProvider, loanId: string, amount: string): Promise<ContractResult> {
    const contract = await configureContract(ethereum);
    return executeContractMethod(() => contract.repayLoan(loanId, { value: ethers.parseUnits(amount, "ether") }), 'Error repaying loan');
}

export async function getLoansByAddress(ethereum: MetaMaskInpageProvider, address: string, onlyActive: boolean): Promise<ContractResult> {
    const contract = await configureContract(ethereum);
    return readContractMethod(() => contract.getLoansByAddress(address, onlyActive), 'Error fetching loans by address');
}

export function useLoan() {
    return {
        requestLoan,
        repayLoan,
        getLoansByAddress
    };
}
