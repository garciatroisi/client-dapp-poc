import { ethers } from 'ethers';
import React from 'react';

interface Loan {
  id: string;
  borrower: string;
  amount: string;
  term: string;
  startTime: string;
  active: string;
  collateralNFTId: string;
}

interface LoanListProps {
  loans: string[];
  onRepayClick: (id: string, amount: string) => void;
  repayLoading: string[];
}

const LoanList: React.FC<LoanListProps> = ({ loans, onRepayClick, repayLoading }) => {

  const parseLoan = (loanString: string): Loan => {
    const [id, borrower, amount, term, startTime, active, collateralNFTId] = loanString.split(',');
    return {
      id,
      borrower,
      amount: ethers.formatEther(amount),
      term,
      startTime,
      active,
      collateralNFTId,
    };
  };

 
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-black mb-4">Loan List</h2>
      {loans.length === 0 ? (
        <p className="text-sm font-bold text-gray-700">No loans available</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-xs leading-normal">
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Collateral</th>
              <th className="py-2 px-4 text-left">Term</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => { 
              const parsedLoan = parseLoan(loan); 
              const loading = repayLoading.includes(parsedLoan.id); // Check if this loan is loading
              return (
                <tr key={index} className="border-b hover:bg-gray-200">
                  <td className="py-2 px-4 text-black">{parsedLoan.amount}</td>
                  <td className="py-2 px-4 text-black">{parsedLoan.collateralNFTId}</td>
                  <td className="py-2 px-4 text-black">{parsedLoan.term}</td>
                  <td className="py-2 px-4 text-black">
                    {loading ? (
                      <span>Loading...</span>
                    ) : (
                      <button onClick={() => onRepayClick(parsedLoan.id, parsedLoan.amount)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1">
                        Repay
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoanList;
