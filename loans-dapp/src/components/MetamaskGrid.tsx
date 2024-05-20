import { useEffect, useState, useCallback } from "react";
import { useMetaMask } from "../hooks/useMetaMask";
import { useLoan } from "../hooks/useLoan";
import { ethers } from "ethers";
import BasicNFT from "../contracts/BasicNFT.json";
import LoanCollateralContract from "../contracts/LoanCollateralContract.json";
import LoanRequest from "./LoanRequest";
import LoanList from "./LoanList";
import TxResult from "./TxResult";
const NETWORK_ID = import.meta.env.VITE_NETWORK_ID;

function MetamaskGrid() {
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState("");
  const [nftBalance, setNftBalance] = useState("");
  const [loans, setLoans] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoanRequestVisible, setIsLoanRequestVisible] = useState(false);
  const [isLoanListVisible, setIsLoanListVisible] = useState(true);
  const [repayLoading, setRepayLoading] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [txResult, setTxResult] = useState<ethers.TransactionResponse | null>(
    null
  );
  const ethereum = useMetaMask();
  const { requestLoan, repayLoan, getLoansByAddress } = useLoan();

  const refreshStatus = async () => {
    await switchChain();
    await getBalances();
    await getLoans();
  };

  const getBalances = async () => {
    try {
      if (!ethereum) return; // MetaMask provider not available
      if (ethereum.selectedAddress) {
        const provider = new ethers.BrowserProvider(ethereum);
        const balance = await provider.getBalance(ethereum.selectedAddress);
        setBalance(ethers.formatEther(balance));

        const signer = await provider.getSigner();

        const contract = new ethers.Contract(
          BasicNFT.address,
          BasicNFT.abi,
          signer
        );
        const userTokenBalance = await contract.balanceOf(
          ethereum.selectedAddress
        );
        setNftBalance(userTokenBalance.toString());
        console.log({ userTokenBalance });
        // Required for loans
        const isApproved = await contract.isApprovedForAll(
          ethereum.selectedAddress,
          LoanCollateralContract.address
        );
        console.log({ isApproved });
        if (!isApproved) {
          await contract.setApprovalForAll(
            LoanCollateralContract.address,
            true
          );
          console.log("loans contract approved");
        }
      }
    } catch (error) {
      console.error("Error getting balances:", error);
    }
  };

  const getLoans = async () => {
    try {
      if (!ethereum) return; // MetaMask provider not available
      if (ethereum.selectedAddress) {
        const resultLoansObject = await getLoansByAddress(
          ethereum,
          ethereum.selectedAddress,
          true
        );

        if (
          resultLoansObject.success &&
          typeof resultLoansObject === "object"
        ) {
          const userLoans = Object.values(resultLoansObject.value).map(
            (obj: unknown) => {
              if (typeof obj === "string") {
                return obj;
              }
              return String(obj);
            }
          );
          setLoans(userLoans);
          console.log(userLoans);
        }
      }
    } catch (error) {
      console.error("Error getting loans:", error);
    }
  };

  const connectMetamask = async () => {
    if (!ethereum) return; // MetaMask provider not available

    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      if (ethereum.selectedAddress) {
        await refreshStatus();
        setConnected(true); // Update connection status
      }
    } catch (error) {
      console.error("Error connecting Metamask:", error);
    }
  };

  const handleRequestLoan = async (amount: string, nftId: string) => {
    try {
      if (!ethereum) return; // MetaMask provider not available
      if (ethereum.selectedAddress) {
        setLoading(true);
        const requestLoanResult = await requestLoan(ethereum, amount, nftId);
        if (requestLoanResult.success) {
          await refreshStatus();
          setNotification("Loan requested successfully!");

          setTimeout(() => {
            setNotification(null);
          }, 3000);
          console.log("Loan requested:", amount, nftId);
        } else {
          // :TODO SETERROR
          // setError(result.error || "An unknown error occurred");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error getting loans:", error);
      setLoading(false);
    }
  };

  const handleRepayClick = async (id: string, amount: string) => {
    try {
      if (!ethereum) return; // MetaMask provider not available
      if (ethereum.selectedAddress) {
        setRepayLoading((prevLoading) => [...prevLoading, id]);
        const repayLoanResult = await repayLoan(ethereum, id, amount);
        if (repayLoanResult.success) {
          setTxResult(repayLoanResult.value);
          await refreshStatus();
          setNotification("Loan repaid successfully!");
          setTimeout(() => {
            setNotification(null);
          }, 3000);
          setRepayLoading((prevLoading) =>
            prevLoading.filter((itemId) => itemId !== id)
          );
        }
      }
    } catch (error) {
      console.error("Error getting loans:", error);
      setRepayLoading((prevLoading) =>
        prevLoading.filter((itemId) => itemId !== id)
      );
    }
  };

  const handleUploadToIPFS = async () => {
    if (txResult) {
      console.log("Uploading to IPFS...");
      try {
        const response = await fetch("http://localhost:3000/upload-to-ipfs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ txResult }),
        });

        if (!response.ok) {
          throw new Error("Error uploading to IPFS");
        }

        const data = await response.json();
        console.log("Upload to IPFS successful:", data);
      } catch (error) {
        console.error("Error uploading to IPFS:", error);
      }
    }
  };

  const switchChain = useCallback(async () => {
    if (ethereum?.isMetaMask) {
      // You can get network info form https://chainid.network/chains.json
      const decimalNumber = parseInt(NETWORK_ID, 10);
      const chainIdHex = ethers.toBeHex(decimalNumber).toString();
      console.log({ chainIdHex });

      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chainIdHex,
            chainName: "Linea Sepolia",
            rpcUrls: ["https://rpc.sepolia.linea.build/"],
            nativeCurrency: {
              name: "Linea Ether",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://sepolia.lineascan.build"],
          },
        ],
      });
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    }
  }, [ethereum]);

  const handleAccount = useCallback(() => { 
    setConnected(false);     
  }, []);

  useEffect(() => {
    console.log("ENTRA useEffect");

    const isMetaMaskInstalled = ethereum?.isMetaMask;
    const isMetaMaskConnected = ethereum?.selectedAddress;

    setInstalled(!!isMetaMaskInstalled); // MetaMask is installed
    setConnected(!!isMetaMaskConnected); // MetaMask is connected

    if (
      isMetaMaskInstalled &&
      isMetaMaskConnected &&
      ethereum.networkVersion !== NETWORK_ID
    ) {
      switchChain();  
    }

    ethereum?.on("chainChanged", handleAccount);
    
  }, [ethereum, switchChain, handleAccount]);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-black font-bold">Metamask Grid</h2>
        {!connected && (
          <button
            onClick={connectMetamask}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Metamask
          </button>
        )}
        {connected && (
          <button
            onClick={refreshStatus}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Refresh Status
          </button>
        )}
      </div>

      {!installed && (
        <p className="text-lg text-black mb-4">
          Install Metamask to connect to the Ethereum network.
        </p>
      )}

      {installed && !connected && (
        <p className="text-lg text-black mb-4">
          Metamask is installed, but not connected.
        </p>
      )}

      {connected && (
        <div>
          <p className="text-xm text-green-500">
            Wallet connected successfully!
          </p>
          <p className="text-xs text-black">
            {ethereum ? ethereum.selectedAddress : ""}
          </p>
          <p className="text-lg text-black mt-2 text-left">
            Balance of ETH: {balance}
          </p>
          <p className="text-lg text-black  text-left">
            Balance of NFTs: {nftBalance}
          </p>
          <div className="m-4 flex justify-end">
            <button
              onClick={() => setIsLoanListVisible(!isLoanListVisible)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              {isLoanListVisible ? "Hide Loan List" : "Loan List"}
            </button>
          </div>
          <div className="m-4 flex justify-end">
            <button
              onClick={() => setIsLoanRequestVisible(!isLoanRequestVisible)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              {isLoanRequestVisible ? "Hide Loan Request" : "Loan Request"}
            </button>
          </div>
          {isLoanListVisible && (
            <LoanList
              loans={loans}
              onRepayClick={handleRepayClick}
              repayLoading={repayLoading}
            />
          )}

          {isLoanRequestVisible && (
            <LoanRequest
              handleRequestLoan={handleRequestLoan}
              loading={loading}
            />
          )}
          {notification && (
            <div className="fixed bottom-0 right-0 mb-4 mr-4 bg-green-500 text-white p-4 rounded-md">
              {notification}
            </div>
          )}
          <div className="m-4">
            {txResult && (
              <TxResult
                txResult={txResult}
                onUploadToIPFS={handleUploadToIPFS}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MetamaskGrid;
