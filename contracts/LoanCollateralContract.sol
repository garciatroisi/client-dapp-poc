// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BasicNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoanCollateralContract is Ownable {
    struct Loan {
        uint256 id;
        address borrower;
        uint256 amount;
        uint256 term;
        uint256 startTime;
        bool active;
        uint256 collateralNFTId;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public loanCounter;

    BasicNFT public nftContract;

    // Eventos
    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 term,
        uint256 collateralNFTId
    );
    event LoanRepaid(uint256 indexed loanId, address indexed borrower);

    constructor(address _nftContract) {
        nftContract = BasicNFT(_nftContract);
    }

    function requestLoan(
        uint256 _amount,
        uint256 _term,
        uint256 _collateralNFTId
    ) external {
        require(_amount > 0, "Loan amount must be greater than 0");
        require(_term > 0, "Term must be greater than 0");
        require(
            nftContract.ownerOf(_collateralNFTId) == msg.sender,
            "You don't own this NFT"
        );
        // Check if the contract has enough native token balance to fulfill the loan
        require(
            address(this).balance >= _amount,
            "Insufficient funds in the loan contract"
        );

        uint256 loanId = loanCounter++;
        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            amount: _amount,
            term: _term,
            startTime: block.timestamp,
            active: true,
            collateralNFTId: _collateralNFTId
        });

        // Transfer the NFT as collateral to the loan contract
        nftContract.transferFrom(msg.sender, address(this), _collateralNFTId);

        // Transfer the loan amount to the borrower
        payable(msg.sender).transfer(_amount);

        // Emitir evento
        emit LoanRequested(
            loanId,
            msg.sender,
            _amount,
            _term,
            _collateralNFTId
        );
    }

    function repayLoan(uint256 _loanId) external payable {
        Loan storage loan = loans[_loanId];
        require(loan.active, "Loan does not exist or has already been repaid");
        require(
            msg.sender == loan.borrower,
            "Only borrower can repay the loan"
        );
        require(msg.value >= loan.amount, "Insufficient funds to repay loan");

        // Transferir la cantidad de ETH al prestamista
        payable(address(this)).transfer(msg.value);

        // Marcar el préstamo como repagado
        loan.active = false;

        // Transferir el NFT de vuelta al prestatario
        nftContract.transferFrom(
            address(this),
            loan.borrower,
            loan.collateralNFTId
        );

        // Emitir evento
        emit LoanRepaid(_loanId, msg.sender);
    }

    // Function to get all loans of an address
    function getLoansByAddress(
        address _borrower,
        bool _onlyActive
    ) external view returns (Loan[] memory) {
        // Inicializar el array de préstamos
        Loan[] memory result = new Loan[](loanCounter);
        uint256 counter = 0;
        for (uint256 i = 0; i < loanCounter; i++) {
            if (
                loans[i].borrower == _borrower &&
                (!_onlyActive || loans[i].active)
            ) {
                result[counter] = loans[i];
                counter++;
            }
        }

        assembly {
            mstore(result, counter)
        }
        return result;
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
