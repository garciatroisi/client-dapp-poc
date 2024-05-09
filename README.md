# client-dapp-poc

The assignment
Customer brief:
The customer is a company quite familiar with the EVM principles, planning to launch a new dApp, but who never used any Consensys products.
They reached out to the Customer Enablement Team of Consensys to see how Consensys products could be used for building their dApp.
Their dApp will be a lending & borrowing platform where end-users can collateralize an NFT to borrow money.

Guidelines:
Develop a PoC to demonstrate how one or many Consensys Products can be used for the customer's purpose. 
It is not expected that the PoC covers all the features of a lending/borrowing platform, but instead,
 to cherry-pick a very limited number of features that would allow you to showcase Consensys products integration and help the customer to clear any technical difficulties he would have.

While on a kickoff call with the customer, you are asked to describe the PoC you will create. What features will it provide and which Consensys products will be used?
Tips:
• Focus on where you think that technical complexity would rely on the customer (eg: the dApp will probably have to list the tokens owned by one user: how should the customer use Infura to get the list of tokens owned by a user)
• The customer brief is unclear on purpose. Think ahead about the interrogations and expectations of the customer (eg: why not use Linea for my dApp?)
• There is no right or wrong answer, you are here to demonstrate your strengths (and not expose your weaknesses too much).
• The video should be no longer than 3-minutes

Solution:

For this Proof of Concept (PoC), I propose integrating ConsenSys products to demonstrate the functionality. 

Here's a brief overview of the features and ConsenSys products I'll utilize:


2. **Linea Dapp - Smart Contracts PoC**: Linea will serve as the foundation for managing loans efficiently and scalably. By leveraging ConsenSys' zkEVM technology, Linea ensures the security and scalability required to process sensitive financial transactions quickly and cost-effectively. Linea will act as the Layer 2 (L2) solution, providing a scalable infrastructure for executing smart contracts efficiently.

3. **NFT Interaction and Integration**: Infura will continue to be used to interact with Linea, mint and fetch the list of tokens owned by users efficiently and securely.

1. **NFT Visualization**: Users can utilize MetaMask to integrate their wallets, enabling seamless interaction with the Linea or any blockchain and securely verifying NFT ownership.

4. **Smart Contract Integration and Audit**: Hardhat partnership will be super useful for the development and testing of smart contracts, while ConsenSys Diligence can be employed to audit smart contracts and ensure their security.

5. **User Interface (UI) Development**: Integrate your dapp with MetaMask using the Wallet API. You can interact with your users' Ethereum accounts, performing multiple tasks

This PoC leverages ConsenSys' tools and technology to deliver a secure, scalable, and efficient lending and NFT-backed borrowing platform that meets the client's requirements and demonstrates the ability to integrate innovative ConsenSys solutions into decentralized applications.


# Abut the code

# deploy 
npx hardhat ignition deploy ignition/modules/LoanCollateralContract.ts --network linea_sepolia

## Verify base
npx hardhat verify --network linea_sepolia 0x3035ff01BB0B98af96cBF33083B23339836a75B6

## Verify loan
npx hardhat verify --network linea_sepolia --constructor-args arguments.ts 0xC2C5Fa133381b2249041e94164d5faAB7DCfcc4e

# dApp

  cd loans-dapp
  npm install
  npm run dev
  