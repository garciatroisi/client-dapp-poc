import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("LoanCollateralContract", (m) => {
  const baseAddress = m.contract("BasicNFT");
  const loanContract = m.contract("LoanCollateralContract", [baseAddress]);

  return { baseAddress, loanContract };
});
