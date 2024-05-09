import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "ethers";

describe("LoanCollateralContract", function () {
  async function deployLoanCollateralFixture() {
    const BasicNFT = await ethers.getContractFactory("BasicNFT");
    const basicNFT = await BasicNFT.deploy();

    const LoanCollateralContract = await ethers.getContractFactory("LoanCollateralContract");

    const loanCollateralContract = await LoanCollateralContract.deploy(await basicNFT.getAddress());

    const loanCollateralContractAddress = await loanCollateralContract.getAddress();



    // Send 1.1 ETH to the deployed contract
    const [deployer] = await ethers.getSigners();
    await deployer.sendTransaction({
      to: loanCollateralContractAddress,
      value: parseEther("1.1")
    });


    return { loanCollateralContract, basicNFT };
  }

  describe("Request Loan", function () {
    it("Should allow borrower to request a loan with valid parameters", async function () {
      const { loanCollateralContract, basicNFT } = await loadFixture(deployLoanCollateralFixture);
      const [borrower] = await ethers.getSigners(); // Use array destructuring to get the first signer
      const collateralNFTId = 1;
      const amount = parseEther("1"); // 1 ETH
      const term = 30; // 30 days 

      await basicNFT.mint(borrower.address, collateralNFTId);

      // Check if borrower owns the NFT
      const ownerOfNFT = await basicNFT.ownerOf(collateralNFTId);
      expect(ownerOfNFT).to.equal(borrower.address);

      const loansAddress = await loanCollateralContract.getAddress();

      // Approve the LoanCollateralContract to transfer the NFT
      await basicNFT.connect(borrower).approve(loansAddress, collateralNFTId);

      const balanceBeforeLoan = await ethers.provider.getBalance(borrower.address);

      await expect(loanCollateralContract.connect(borrower).requestLoan(amount, term, collateralNFTId))
        .to.emit(loanCollateralContract, "LoanRequested");

      const balanceAfterLoan = await ethers.provider.getBalance(borrower.address);

      expect(balanceAfterLoan).to.be.gt(balanceBeforeLoan);
    });

  });

  describe("Repay Loan", function () {
    it("Should allow borrower to repay the loan", async function () {
      const { loanCollateralContract, basicNFT } = await loadFixture(deployLoanCollateralFixture);
      const [borrower] = await ethers.getSigners(); // Use array destructuring to get the first and second signer

      const collateralNFTId = 1;
      const amount = parseEther("1"); // 1 ETH
      const term = 30; // 30 days 

      // Mint NFT and request loan
      await basicNFT.mint(borrower.address, collateralNFTId);
      const loansAddress = await loanCollateralContract.getAddress();
      await basicNFT.connect(borrower).approve(loansAddress, collateralNFTId);


      await loanCollateralContract.connect(borrower).requestLoan(amount, term, collateralNFTId);

      // Repay loan immediately after requesting it
      const loanId = 0; // Assuming there's only one loan in this test
      const loan = await loanCollateralContract.loans(loanId);
      const balanceBeforeRepayment = await ethers.provider.getBalance(loansAddress);

      // Check if LoanRepaid event is emitted
      await expect(
        loanCollateralContract.repayLoan(loanId, { value: loan.amount }))
        .to.emit(loanCollateralContract, "LoanRepaid")
        .withArgs(loanId, borrower.address);

      // Check if NFT is transferred back to borrower
      const newOwner = await basicNFT.ownerOf(collateralNFTId);
      expect(newOwner).to.equal(borrower.address);

      const balanceAfterRepayment = await ethers.provider.getBalance(loansAddress);
      // Check if loan is repaid and funds are transferred to lender
      expect(balanceAfterRepayment).to.be.gt(balanceBeforeRepayment);

    });
  });


  describe("Get Loans By Address", function () {
    it("Should return loans array with all loan information", async function () {
      const { loanCollateralContract, basicNFT } = await loadFixture(deployLoanCollateralFixture);
      const [borrower] = await ethers.getSigners(); // Use array destructuring to get the first signer
      const collateralNFTId = 1;
      const collateralNFTId2 = 22;
      const amount = parseEther("0.1"); // 1 ETH
      const term = 30; // 30 days 

      await basicNFT.mint(borrower.address, collateralNFTId);

      const loansAddress = await loanCollateralContract.getAddress();

      // Approve the LoanCollateralContract to transfer the NFT
      await basicNFT.connect(borrower).approve(loansAddress, collateralNFTId);

      await expect(loanCollateralContract.connect(borrower).requestLoan(amount, term, collateralNFTId))
        .to.emit(loanCollateralContract, "LoanRequested");

      await basicNFT.mint(borrower.address, collateralNFTId2);
      const ownerOfNFT = await basicNFT.ownerOf(collateralNFTId2);
      expect(ownerOfNFT).to.equal(borrower.address);

      await basicNFT.connect(borrower).approve(loansAddress, collateralNFTId2);
      await expect(loanCollateralContract.connect(borrower).requestLoan(amount, term, collateralNFTId2))
        .to.emit(loanCollateralContract, "LoanRequested");

      const onlyActive = true;
      const loansArray = await loanCollateralContract.getLoansByAddress(borrower.address, onlyActive);

      // Assert that loansArray is not empty
      expect(loansArray).to.not.be.empty;

      // Assert that loansArray is an array of objects
      expect(loansArray).to.be.an("array");
      
      expect(loansArray.length).to.equal(2);

      loansArray.forEach(loan => {
        expect(Object.keys(loan).length).to.equal(7);
      });

    });
  });

});
