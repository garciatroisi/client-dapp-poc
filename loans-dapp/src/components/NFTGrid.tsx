import { useState } from "react";
import { ethers } from "ethers";
import BasicNFT from "../contracts/BasicNFT.json";

function WalletNFTs() {
  const [address, setAddress] = useState("");
  const [userNFTs, setUserNFTs] = useState<number[]>([]); // Initialize as an empty array of strings

  // Function to fetch wallet NFTs
  const fetchWalletNFTs = async () => {
    if (!address) return;

    try {
      const API_KEY = import.meta.env.VITE_APP_API_KEY;
      const infuraProvider = new ethers.InfuraProvider(
        "linea-sepolia",
        API_KEY
      );
      const contract = new ethers.Contract(
        BasicNFT.address,
        BasicNFT.abi,
        infuraProvider
      );

      // Get the user's NFTs
      const userNFTs = await contract.balanceOf(address);

      console.log("User's NFTs:", userNFTs);

      // Update state with user's NFTs
      const nftsArray = [];
      for (let i = 1; i <= userNFTs; i++) {
        nftsArray.push(i);
      }

      console.log("User's nftsArray:", nftsArray);
      setUserNFTs(nftsArray); // Populate with the numbers from 1 to the number of NFTs
    } catch (error) {
      console.error("Error fetching wallet NFTs:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWalletNFTs();
  };

  return (
    <div className="flex flex-col items-center justify-top mt-5 h-screen">
      <h2 className="text-xl text-light font-bold mb-5">Infura Grid</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Enter wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border border-gray-400 rounded px-4 py-2 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch NFTs
        </button>
      </form>
      <div className="flex flex-wrap justify-center max-w-[300px] mx-auto">
        {userNFTs.length === 0 ? (
          <div className="m-2 text-center text-gray-500">Nothing to show</div>
        ) : (
          userNFTs.map((nft, index) => (
            <div
              key={index}
              className="m-2 bg-green-800 rounded-full w-10 h-10 flex items-center justify-center text-white"
            >
              {nft}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WalletNFTs;
