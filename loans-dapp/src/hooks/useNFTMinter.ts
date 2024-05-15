import { ethers } from 'ethers';
import BasicNFT from "../contracts/BasicNFT.json";
import { ContractResult } from "../interfaces/ContractResult";

// Function to configure the contract instance
async function configureContract(): Promise<ethers.Contract> {  

    const API_KEY = import.meta.env.VITE_APP_API_KEY;
    const infuraProvider = new ethers.InfuraProvider("linea-sepolia", API_KEY);
    const PRIVATE_KEY = import.meta.env.VITE_APP_PRIVATE_KEY;
    const signer = new ethers.Wallet(PRIVATE_KEY, infuraProvider);  

    // Return a new instance of the contract
    return new ethers.Contract(
        BasicNFT.address,
        BasicNFT.abi,
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

export async function mintNFT(address: string, nftId: string): Promise<ContractResult> {
    const contract = await configureContract();
    return executeContractMethod(() => contract.mint(address, nftId), 'Error minting NFT');
}

export function useNFTMinter() {
    return {
        mintNFT
    };
}
