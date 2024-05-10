# Client-Dapp-POC

## Description

This project is a Proof of Concept (PoC) demonstrating the functionality of a decentralized application (DApp) that deploys smart contracts on the Linea network and then utilizes them with Infura and MetaMask. The ConsenSys suite is used to showcase how we can interact with the blockchain.


Here's a brief overview of the features and ConsenSys products I'll utilize:


1. **Linea Dapp - Smart Contracts PoC**: Linea stands out as an excellent choice, serving as a robust foundation for handling transactions efficiently and at scale. Leveraging ConsenSys' zkEVM technology, Linea ensures both the security and scalability required for processing transactions swiftly and cost-effectively. Operating as a Layer 2 (L2) solution, Linea provides a scalable infrastructure customized for the streamlined execution of smart contracts.

2. **Smart Contract Integration and Audit**: Our partnership with Hardhat proves invaluable for the seamless development and rigorous testing of smart contracts. Concurrently, leveraging ConsenSys Diligence ensures that smart contracts undergo thorough audits to fortify their security.

3. **NFT Interaction and Integration**: The continued utilization of Infura remains pivotal for seamless interaction with Linea, facilitating the minting and retrieval of users' token lists efficiently and securely.

4. **Loans Visualization**: Integration with MetaMask empowers users to seamlessly connect their wallets, facilitating effortless interaction with Linea or any blockchain. This integration provides a secure platform for users to verify and manage their loans with ease.

5. **Utilizing Infura for IPFS Uploads**: Leveraging Infura's robust infrastructure, Linea streamlines the process of uploading files to the InterPlanetary File System (IPFS). This integration ensures that files are securely uploaded to IPFS, providing a decentralized and immutable storage solution.

This PoC leverages ConsenSys' tools and technology to deliver a secure, scalable, and efficient lending and NFT-backed borrowing platform that meets the client's requirements and demonstrates the ability to integrate innovative ConsenSys solutions into decentralized applications.


## Usage

Please replace `[NETWORK_NAME]` with the name of the network you're deploying to, 
`[BASE_CONTRACT_ADDRESS]` with the address of the base contract, 
and `[LOAN_CONTRACT_ADDRESS]` with the address of the specific loan contract. 

### Deployment

To deploy a contract, run the following command:
 ```
 npx hardhat ignition deploy ignition/modules/LoanCollateralContract.ts --network [NETWORK_NAME]
 ```

Example:
 ```
npx hardhat ignition deploy ignition/modules/LoanCollateralContract.ts --network linea_sepolia
 ```
 

To verify the base contract, execute:

 ```
npx hardhat verify --network [NETWORK_NAME] [BASE_CONTRACT_ADDRESS]
 ```

Example:
 ```
npx hardhat verify --network linea_sepolia 0x3035ff01BB0B98af96cBF33083B23339836a75B6
 ```


To verify a loan contract with specific arguments, 
replace `arguments.ts` the BaseNFT address and run:

 ```
 npx hardhat verify --network [NETWORK_NAME] --constructor-args arguments.ts [LOAN_CONTRACT_ADDRESS]
 ```

Example:
 ```
npx hardhat verify --network linea_sepolia --constructor-args arguments.ts 0xC2C5Fa133381b2249041e94164d5faAB7DCfcc4e
 ```

### DApp

To run the DApp, follow these steps:

1. Navigate to the `loans-dapp` directory.
2. Install dependencies with `npm install`.
3. Run the DApp with `npm run dev`.

### Backend

We have a backend for uploading transaction results to IPFS. 
To execute it, follow these steps:

1. Navigate to the `backend` directory.
2. Install dependencies with `npm install`.
3. Run the DApp with `npm start`.

  
