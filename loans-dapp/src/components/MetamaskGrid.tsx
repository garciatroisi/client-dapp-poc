import { useEffect, useState } from "react";
import { useMetaMask } from "../hooks/useMetaMask";
import { ethers } from "ethers";
import BasicNFT from "../contracts/BasicNFT.json";
import LoanCollateralContract from "../contracts/LoanCollateralContract.json";
import LoanRequest from "./LoanRequest";
import LoanList from "./LoanList";

function MetamaskGrid() {
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState("");
  const [nftBalance, setNftBalance] = useState("");
  const [loans, setLoans] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoanRequestVisible, setLoanRequestVisible] = useState(false);
  const [isLoanListVisible, setLoanListVisible] = useState(true);

  const ethereum = useMetaMask();

  const refreshStatus = async () => {
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
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(
          LoanCollateralContract.address,
          LoanCollateralContract.abi,
          signer
        );

        const resultLoansObject = await contract.getLoansByAddress(
          ethereum.selectedAddress,
          true
        );
        
        if (resultLoansObject) {
          const userLoans = Object.values(resultLoansObject).map((obj) =>
            obj.toString()
          );
          setLoans(userLoans);
          console.log( userLoans );
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
        await getBalances();
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
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(
          LoanCollateralContract.address,
          LoanCollateralContract.abi,
          signer
        );
        const parsedAmount = ethers.parseUnits(amount, "ether");
        const parsedNftId = parseInt(nftId);
        await contract.requestLoan(parsedAmount, 30, parsedNftId);
        await getLoans();
        setNotification("Loan requested successfully!");

        setTimeout(() => {
          setNotification(null);
        }, 3000);
        console.log("Loan requested:", parsedAmount, parsedNftId);
      }
    } catch (error) {
      console.error("Error getting loans:", error);
    }
  };

  const handleRepayClick = (id: string) => {
    console.log(`Repaying loan with ID: ${id}`);
  };

  useEffect(() => {
    if (ethereum && ethereum.isMetaMask) {
      setInstalled(true); // MetaMask is installed
    } else {
      setInstalled(false);
    }

    if (ethereum && ethereum.isMetaMask && ethereum.selectedAddress) {
      setConnected(true); // MetaMask is connected
    } else {
      setConnected(false);
    }
  }, [ethereum]);

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
              onClick={() => setLoanListVisible(!isLoanListVisible)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              {isLoanListVisible ? "Hide Loan List" : "Loan List"}
            </button>
          </div>
          <div className="m-4 flex justify-end">
            <button
              onClick={() => setLoanRequestVisible(!isLoanRequestVisible)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              {isLoanRequestVisible ? "Hide Loan Request" : "Loan Request"}
            </button>
          </div>

          {isLoanListVisible && <LoanList loans={loans} onRepayClick={handleRepayClick} />}
          {isLoanRequestVisible && (
            <LoanRequest handleRequestLoan={handleRequestLoan} />
          )}
          {notification && (
            <div className="fixed bottom-0 right-0 mb-4 mr-4 bg-green-500 text-white p-4 rounded-md">
              {notification}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MetamaskGrid;
