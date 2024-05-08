import { useState } from "react";
import { ethers } from "ethers";
import BasicNFT from "../contracts/BasicNFT.json";

function Mint() {
  const API_KEY = import.meta.env.VITE_APP_API_KEY;
  const PRIVATE_KEY = import.meta.env.VITE_APP_PRIVATE_KEY;
  // const provider_Metamask = new ethers.providers.Web3Provider(window.ethereum);
  const infuraProvider = new ethers.InfuraProvider("linea-sepolia", API_KEY);

  const [address, setAddress] = useState("");
  const [nftId, setNftId] = useState("");

  const handleMint = async () => {
    const balance = await infuraProvider.getBalance(address);
    const balanceEth = ethers.formatEther(balance);
    console.log({ balanceEth });
    // 0xf41671100948bcb80CB9eFbD3fba16c2898d9ef7

    try {
      // Create a signer using the private key and provider
      const signer = new ethers.Wallet(PRIVATE_KEY, infuraProvider);

      // Create an instance of the BasicNFT contract
      const basicNFTContract = new ethers.Contract(
        BasicNFT.address,
        BasicNFT.abi,
        signer
      );

      // Call the mint function of the contract
      const tx = await basicNFTContract.mint(address, nftId);

      // Wait for the transaction to be confirmed
      await tx.wait();

      console.log("Mint successful!");
    } catch (error) {
      console.error("Error executing mint:", error);
    }

    console.log(`Minting NFT with address: ${address} and NFT ID: ${nftId}`);
    console.log(`balance: ${balanceEth} `);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <input
        type="text"
        placeholder="Address"
        className="border border-gray-400 rounded px-4 py-2 mb-4"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="NFT ID"
        className="border border-gray-400 rounded px-4 py-2 mb-4"
        value={nftId}
        onChange={(e) => setNftId(e.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleMint}
      >
        Mint
      </button>
    </div>
  );
}

export default Mint;
