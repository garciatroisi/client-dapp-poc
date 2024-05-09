import { useState } from "react";
import { ethers } from "ethers";
import BasicNFT from "../contracts/BasicNFT.json";

function Mint() {
  const API_KEY = import.meta.env.VITE_APP_API_KEY;
  const PRIVATE_KEY = import.meta.env.VITE_APP_PRIVATE_KEY;
  const infuraProvider = new ethers.InfuraProvider("linea-sepolia", API_KEY);

  const [address, setAddress] = useState("");
  const [nftId, setNftId] = useState("");
  const [mintSuccess, setMintSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // State variable for loading state

  const handleMint = async () => {
    try {
      setLoading(true); // Set loading state to true
      const signer = new ethers.Wallet(PRIVATE_KEY, infuraProvider);

      const basicNFTContract = new ethers.Contract(
        BasicNFT.address,
        BasicNFT.abi,
        signer
      );

      const tx = await basicNFTContract.mint(address, nftId);
      await tx.wait();

      console.log("Mint successful!");
      setMintSuccess(true);

      setTimeout(() => {
        setMintSuccess(false); // Reset mint success after 3 seconds
        setLoading(false); // Reset loading state after 3 seconds
      }, 3000); // 3000 milliseconds = 3 seconds
    } catch (error) {
      console.error("Error executing mint:", error);
      setLoading(false); // Reset loading state on error
    }
  };

  return (
    <div className="flex flex-col items-center justify-top mt-5 p-4">      
      <h2 className="text-xl text-light font-bold mb-5">Mint Grid</h2>
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
        disabled={loading} // Disable button when loading
      >
        {loading ? 'Loading...' : 'Mint'} {/* Change button text based on loading state */}
      </button>
      {mintSuccess && (
        <p className="text-green-500">Mint successful!</p>
      )}
    </div>
  );
}

export default Mint;
