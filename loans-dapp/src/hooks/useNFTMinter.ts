import { ethers } from 'ethers';
import BasicNFT from "../contracts/BasicNFT.json"; 
import { MintResult } from "../interfaces/MintResult"; 

// Function to interact with the basic NFT contract
async function mintBasicNFT(address: string, nftId: string, signer: ethers.Signer): Promise<MintResult> {
    const basicNFTContract = new ethers.Contract(
        BasicNFT.address,
        BasicNFT.abi,
        signer
    );

    try {
        const tx = await basicNFTContract.mint(address, nftId);
        await tx.wait(); // Wait for the transaction to be confirmed on the chain
        return { success: true };
    } catch (error) {
        console.error('Error minting NFT:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}

// Custom hook to handle NFT minting logic
function useNFTMinter(): {
    mintNFT: (address: string, nftId: string) => Promise<MintResult>;
} {
    const API_KEY = import.meta.env.VITE_APP_API_KEY;
    const infuraProvider = new ethers.InfuraProvider("linea-sepolia", API_KEY);
    const PRIVATE_KEY = import.meta.env.VITE_APP_PRIVATE_KEY;

    // Function to perform NFT minting
    const mintNFT = async (address: string, nftId: string): Promise<MintResult> => {
        try {
            const signer = new ethers.Wallet(PRIVATE_KEY, infuraProvider);
            const result = await mintBasicNFT(address, nftId, signer);
            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
        }
    };

    return {
        mintNFT,
    };
}

export default useNFTMinter;
