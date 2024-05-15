import { ethers } from 'ethers';
import type { MetaMaskInpageProvider } from "@metamask/providers";
import { ContractResult } from "../interfaces/ContractResult";
import LoanCollateralContract from "../contracts/LoanCollateralContract.json";
import { emptyObjTxResult } from '../interfaces/ObjTxResult';

async function requestLoan(ethereum: MetaMaskInpageProvider, amount: string, nftId: string): Promise<ContractResult> {
    try {
        if (!ethereum) throw new Error('Ethereum instance not provided');

        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(
            LoanCollateralContract.address,
            LoanCollateralContract.abi,
            signer
        );

        const parsedAmount = ethers.parseUnits(amount, "ether");
        const parsedNftId = parseInt(nftId);

        const tx = await contract.requestLoan(parsedAmount, 30, parsedNftId);
        await tx.wait(); // Wait for the transaction to be confirmed on the chain
        return { success: true, value: tx };
    } catch (error) {
        console.error("Error requesting loan:", error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred', value: emptyObjTxResult() };
    }
}

async function repayLoan(ethereum: MetaMaskInpageProvider, loanId: string, amount: string): Promise<ContractResult> {
    try {
        if (!ethereum) throw new Error('Ethereum instance not provided');

        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(
            LoanCollateralContract.address,
            LoanCollateralContract.abi,
            signer
        );

        const parsedAmount = ethers.parseUnits(amount, "ether");

        const tx = await contract.repayLoan(loanId, {
            value: parsedAmount,
        });
        await tx.wait(); // Wait for the transaction to be confirmed on the chain
        return { success: true, value: tx };
    } catch (error) {
        console.error("Error repaying loan:", error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred', value: emptyObjTxResult() };
    }
}

export function useLoan() {
    return {
        requestLoan: (ethereum: MetaMaskInpageProvider, amount: string, nftId: string) => requestLoan(ethereum, amount, nftId),
        repayLoan: (ethereum: MetaMaskInpageProvider, loanId: string, amount: string) => repayLoan(ethereum, loanId, amount)
    };
}