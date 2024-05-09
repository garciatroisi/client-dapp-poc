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


 
PART 2: The presentation
Put together a brief customer presentation showcasing the PoC you created.
Include:
- The technical key points and highlight the Consensys products used
- A review of the codebase of the different components and how Consensys products are implemented
- A placeholder slide for you to demo the PoC when presenting
In the following question you will be asked to present this to the customer.


Solution:

For this Proof of Concept (PoC), I propose integrating ConsenSys products to demonstrate the functionality. 

Here's a brief overview of the features and ConsenSys products I'll utilize:


1. **Linea Dapp - Smart Contracts PoC**: Linea stands out as an excellent choice, serving as a robust foundation for handling transactions efficiently and at scale. Leveraging ConsenSys' zkEVM technology, Linea ensures both the security and scalability required for processing transactions swiftly and cost-effectively. Operating as a Layer 2 (L2) solution, Linea provides a scalable infrastructure customized for the streamlined execution of smart contracts.

2. **Smart Contract Integration and Audit**: Our partnership with Hardhat proves invaluable for the seamless development and rigorous testing of smart contracts. Concurrently, leveraging ConsenSys Diligence ensures that smart contracts undergo thorough audits to fortify their security.

3. **NFT Interaction and Integration**: The continued utilization of Infura remains pivotal for seamless interaction with Linea, facilitating the minting and retrieval of users' token lists efficiently and securely.

4. **Loans Visualization**: Integration with MetaMask empowers users to seamlessly connect their wallets, facilitating effortless interaction with Linea or any blockchain. This integration provides a secure platform for users to verify and manage their loans with ease.

5. **Utilizing Infura for IPFS Uploads**: Leveraging Infura's robust infrastructure, Linea streamlines the process of uploading files to the InterPlanetary File System (IPFS). This integration ensures that files are securely uploaded to IPFS, providing a decentralized and immutable storage solution. By harnessing Infura's reliable services, Linea enhances data integrity and accessibility for users, further bolstering the platform's efficiency and resilience.

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
  