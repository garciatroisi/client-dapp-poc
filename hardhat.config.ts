import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();
const {
  INFURA_LINEA_API_RPC,
  DEPLOYER_ADDRESS_PRIVATE_KEY,
  LINEASCAN_API_KEY,
} = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    linea_sepolia: {
      url: INFURA_LINEA_API_RPC,
      accounts: [`0x${DEPLOYER_ADDRESS_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      linea_sepolia: LINEASCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "linea_sepolia",
        chainId: 59141,
        urls: {
          apiURL: "https://api-sepolia.lineascan.build/api",
          browserURL: "https://sepolia.lineascan.build/address",
        },
      },
    ],
  },
};

export default config;
