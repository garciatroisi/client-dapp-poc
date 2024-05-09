import React, { useState } from 'react';

interface Props {
  handleRequestLoan: (amount: string, nftId: string) => void;
}

const LoanRequest: React.FC<Props> = ({ handleRequestLoan }) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [nftId, setNftId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Agregar el prefijo "0.0" al valor de amount
    const formattedAmount = `0.0${loanAmount}`;
    handleRequestLoan(formattedAmount, nftId);
    // Limpieza de los campos del formulario después de enviar
    setLoanAmount('');
    setNftId('');
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
    <h2 className="text-xl text-black font-bold mb-4">Request Loan</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-4"> 
        <input
          type="text"
          id="amount"
          value={`0.0${loanAmount}`}
          onChange={(e) => setLoanAmount(e.target.value.replace(/^0.0/, ''))}
          placeholder="Amount (0.0 prefixed)"
          className="w-full mt-1 px-4 py-2 border bg-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
      </div>
      <div className="mb-4"> 
        <input
          type="text"
          id="nftId"
          value={nftId}
          onChange={(e) => setNftId(e.target.value)}
          placeholder="NFT ID"
          className="w-full mt-1 px-4 py-2 border bg-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Request Loan
      </button>
    </form>
  </div>
  
  );
};

export default LoanRequest;
