import { useState } from "react";
import useNFTMinter from "../hooks/useNFTMinter";
import { MintResult } from "../interfaces/MintResult"; 


function Mint() {
  const [address, setAddress] = useState("");
  const [nftId, setNftId] = useState("");
  const [mintSuccess, setMintSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | string | null>(null);
  const { mintNFT } = useNFTMinter();

  const handleMint = async () => {
    try {
      setLoading(true); // Set loading state to true before making the call
      setError(null); // Reset the error when attempting to mint again
      const result: MintResult = await mintNFT(address, nftId);
      if (result.success) {
        console.log("Mint successful!");
        setMintSuccess(true);
      } else {
        setError(result.error || "An unknown error occurred");
      }
      setTimeout(() => {
        setMintSuccess(false); // Reset mint success after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error executing mint:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false); // Set loading state back to false after the operation
    }
  };

  return (
    <div className="flex flex-col items-center justify-top mt-5 p-4 overflow-y-auto">
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
        {loading ? "Loading..." : "Mint"}{" "}
        {/* Change button text based on loading state */}
      </button>
      {mintSuccess && <p className="text-green-500">Mint successful!</p>}
      {typeof error === "string" && (
        <p className="text-red-500 max-w-[300px] mt-2 mb-0 ml-4 mr-4 text-sm">Error: {error}</p>
      )}
    </div>
  );
  
  
}

export default Mint;
