MultisenderSDK - Ethereum Batch Transaction Toolkit

The MultisenderSDK is a TypeScript-based SDK designed to streamline batch transactions on the Ethereum blockchain. It integrates with an audited open-source multisend contract, supporting both native ETH and ERC-20 token transfers, with built-in gas estimation for cost efficiency.
Features

    Batch ETH Transfers: Send ETH to multiple recipients in a single transaction.

    Batch ERC-20 Transfers: Handle token transfers with automatic approval processing.

    Dynamic Gas Estimation: Uses real-time fee data for accurate gas limit calculations.

    Transaction Status Tracking: Monitor transaction confirmations and status.

    Flexible Configuration: Compatible with any multisend contract that meets the Solidity 0.8.20 and auditing requirements.

Prerequisites

    Node.js: Version 16 or higher

    ethers.js: Version 6.x

    Ethereum Provider: Access to an RPC endpoint (e.g., Infura, Alchemy)

    Wallet: A private key or mnemonic for signing transactions

    Deployed Contract: Address of the multisend contract (Solidity 0.8.20, audited)

Installation
Set Up Your Project

Create a new Node.js project or use an existing one:

npm init -y

Install ethers.js

npm install ethers

Add MultisenderSDK

Save the MultisenderSDK class (from the provided code) into a file, e.g., multisender.ts, in your project directory.
Quick Start
Initialize the SDK

import { ethers } from 'ethers';
import { MultisenderSDK } from './multisender'; // Adjust path as necessary

// Configure provider and signer
const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY');
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
const contractAddress = '0xYourDeployedContractAddress';

// Create SDK instance
const multisender = new MultisenderSDK(provider, contractAddress, signer);

Send ETH in Batch

async function sendEth() {
  const recipients = ['0xRecipient1', '0xRecipient2'];
  const amounts = ['0.1', '0.2']; // ETH amounts

  try {
    const tx = await multisender.sendEthBatch(recipients, amounts);
    console.log(`ETH batch sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
  } catch (error) {
    console.error('Failed to send ETH batch:', error.message);
  }
}

sendEth();

Send ERC-20 Tokens in Batch

async function sendTokens() {
  const tokenAddress = '0xTokenContractAddress'; // e.g., USDC
  const recipients = ['0xRecipient1', '0xRecipient2'];
  const amounts = ['10', '20']; // Token amounts (adjusted for decimals)

  try {
    const tx = await multisender.sendTokenBatch(tokenAddress, recipients, amounts);
    console.log(`Token batch sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
  } catch (error) {
    console.error('Failed to send token batch:', error.message);
  }
}

sendTokens();

API Overview
Constructor

new MultisenderSDK(provider: ethers.JsonRpcProvider, contractAddress: string, signer: ethers.Wallet)

    provider: Ethereum RPC provider

    contractAddress: Deployed multisend contract address

    signer: Wallet for signing transactions

Methods

    sendEthBatch(recipients: string[], amounts: string[]): Promise<ethers.TransactionResponse>
    Sends ETH to multiple recipients in one transaction.

    sendTokenBatch(tokenAddress: string, recipients: string[], amounts: string[]): Promise<ethers.TransactionResponse>
    Sends ERC-20 tokens to multiple recipients, handling approvals if needed.

    getTransactionStatus(txHash: string): Promise<ethers.TransactionReceipt | null>
    Retrieves the receipt for a given transaction hash.

Gas Estimation

The SDK calculates gas dynamically:

    Uses estimateGas for accurate limits, with a 20% buffer.

    Fetches maxPriorityFeePerGas and block baseFeePerGas for fee optimization.

    Ensures sufficient ETH balance for both fees and transfers.

Error Handling

Common errors are caught and logged, including:

    Insufficient Balance: For ETH or tokens.

    Invalid Recipient/Amount Arrays: Ensuring inputs are valid.

    Gas Estimation Failures: Handling exceptions during fee calculation.

Configuration

    Custom Provider: Swap the provider URL or use a different service (e.g., Alchemy).

    Contract Address: Update to match your deployed multisend contract.

    Signer: Use a different wallet or connect via a browser provider (e.g., MetaMask).

Example Deployment

    Deploy the multisend contract using Hardhat or Remix.

    Fund your wallet with ETH for gas and fees.

    Test on a testnet (e.g., Sepolia) before mainnet use.

Troubleshooting

    "Insufficient balance": Ensure the signer has enough ETH for both gas and transfers.

    "Allowance too low": The SDK auto-approves tokens, but verify token contract compatibility.

    Transaction failures: Confirm that the contract address and network are correctly configured.

Contributing

Feel free to fork, modify, and submit pull requests. Contributions such as adding unit tests or new features are welcome.
License

MIT License - Free to use, modify, and distribute.
