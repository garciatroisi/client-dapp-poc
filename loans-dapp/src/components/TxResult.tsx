import React, { useState } from "react";
import { ObjTxResult } from "../types/ObjTxResult";

interface Props {
  txResult: ObjTxResult;
  onUploadToIPFS: () => void; // Definimos la función de manejo de eventos para cargar a IPFS
}

const TxResult: React.FC<Props> = ({ txResult, onUploadToIPFS }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleUploadToIPFS = () => {
    // Llamar a la función proporcionada por el padre para cargar a IPFS
    onUploadToIPFS();
    console.log("Data uploaded to IPFS:", txResult);
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="bg-red-300 p-2 rounded-md shadow-md text-sm font-semibold text-gray-700 hover:bg-gray-200"
      >
        View Repay Loan Result
      </button>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md max-w-screen-sm overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-black">
                Repay Loan Result
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Transaction Details
                </h3>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="text-xs text-gray-900 pr-4 pb-2">Hash:</td>
                      <td className="text-xs text-gray-900 pb-2">
                        {txResult.hash}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-xs text-gray-900 pr-4 pb-2">From:</td>
                      <td className="text-xs text-gray-900 pb-2">
                        {txResult.from}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-xs text-gray-900 pr-4 pb-2">To:</td>
                      <td className="text-xs text-gray-900 pb-2">
                        {txResult.to}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Transaction Data
                </h3>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <pre className="text-xs text-gray-900 pb-2 whitespace-pre-wrap">
                        {txResult.data}
                      </pre>
                    </tr>
                  </tbody>
                </table>
              </div> 
            </div>
            <button
              onClick={handleUploadToIPFS}
              className="mt-4 bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Upload to IPFS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TxResult;
