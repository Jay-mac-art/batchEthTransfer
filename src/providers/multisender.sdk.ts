import { ethers } from 'ethers';

export class MultisenderSDK {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contractAddress : ethers.AddressLike;
  private contract: ethers.Contract;

  constructor(provider: ethers.JsonRpcProvider, contractAddress: string, signer: ethers.Wallet) {
    this.provider = provider;
    this.signer = signer;
    this.contractAddress = contractAddress;
    // contract ABI
    const abi = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
          }
        ],
        "name": "ClaimedTokens",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "EthReceived",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "total",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          }
        ],
        "name": "Multisended",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          }
        ],
        "name": "claimTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
          }
        ],
        "name": "multisendEther",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
          }
        ],
        "name": "multisendToken",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "newLimit",
            "type": "uint256"
          }
        ],
        "name": "setArrayLimit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "newFee",
            "type": "uint256"
          }
        ],
        "name": "setFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "stateMutability": "payable",
        "type": "receive"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "initialOwner",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "arrayLimit",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "fee",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];


    this.contract = new ethers.Contract(contractAddress, abi, signer);
  }

  async sendEthBatch(recipients: string[], amounts: string[]): Promise<ethers.TransactionResponse> {
    try {
      const senderAddress =  this.signer.getAddress();
       
        
        const amountsInWei = amounts.map(a => ethers.parseEther(a));
        const totalValue = amountsInWei.reduce((sum, a) => sum + a, 0n);
        const fee = await this.contract.fee();
        const totalRequired = totalValue + fee;

       
        const block = await this.provider.getBlock("latest");
        const baseFee = block?.baseFeePerGas || BigInt(0);
        const maxPriorityFee = await this.provider.send("eth_maxPriorityFeePerGas", []);
        const maxFeePerGas = baseFee * BigInt(2) + BigInt(maxPriorityFee);
        const nonce = await this.provider.getTransactionCount( senderAddress, 'pending');
       
        const estimatedGas = await this.contract.multisendEther.estimateGas(
            recipients,
            amountsInWei,
            { value: totalRequired }
        );

       
        const gasLimit = estimatedGas * BigInt(120) / BigInt(100);

       
        const balance = await this.provider.getBalance(this.contractAddress);
        const totalCost = totalRequired + (gasLimit * maxFeePerGas);
        
        if (balance < totalCost) {
            throw new Error(`Insufficient balance. Needed ${ethers.formatEther(totalCost)} ETH, have ${ethers.formatEther(balance)} ETH`);
        }

        
        const tx = await this.contract.multisendEther(
          recipients,
          amountsInWei,
          {
              value: totalRequired,
              gasLimit,
              maxFeePerGas,
              maxPriorityFeePerGas: maxPriorityFee,
              nonce
          }
      );
        
        return tx;
    } catch (error) {
        console.error('Error sending ETH batch:', error);
        throw error;
    }
}

async sendTokenBatch(
  tokenAddress: string,
  recipients: string[],
  amounts: string[]
): Promise<ethers.TransactionResponse> {
  try {
      const senderAddress = await this.signer.getAddress();

    
      let decimals = 18;
      let nonce;
      try {
          const token = new ethers.Contract(
              tokenAddress,
              ['function decimals() view returns (uint8)'],
              this.provider
          );
          decimals = await token.decimals();
      } catch {
          console.warn('Using default decimals (18)');
      }

    
      const amountsInWei = amounts.map(a => ethers.parseUnits(a, decimals));
     

      
      const fee = await this.contract.fee();
      nonce = await this.provider.getTransactionCount( senderAddress, 'pending');
     
      const feeData = await this.provider.getFeeData();
      const maxPriorityFee = feeData.maxPriorityFeePerGas || 0n;
      const maxFeePerGas = feeData.maxFeePerGas || 0n;

    
      const estimatedGas = await this.contract.multisendToken.estimateGas(
          tokenAddress,
          recipients,
          amountsInWei,
          { value: fee }
      ).catch(() => 500000n); // Fallback
      const gasLimit = estimatedGas * BigInt(120) / BigInt(100);

      
      const balance = await this.provider.getBalance(senderAddress);
      const estimatedGasCost = gasLimit * maxFeePerGas;
      const totalEthNeeded = fee + estimatedGasCost;
      if (balance < totalEthNeeded) {
          throw new Error(
              `Insufficient ETH. Needed: ${ethers.formatEther(fee + estimatedGasCost)} ETH\n` +
              `Have: ${ethers.formatEther(balance)} ETH`
          );
      }

    //Optional Allowance logic
      const tokenContract = new ethers.Contract(
          tokenAddress,
          ['function approve(address,uint256)', 'function allowance(address,address) view returns (uint256)'],
          this.signer
      );
      const allowance = await tokenContract.allowance(senderAddress, this.contract.target);
      if (allowance < totalEthNeeded) {
          const approveTx = await tokenContract.approve(
              this.contract.target,
              totalEthNeeded
          );
          await approveTx.wait(2); 
      }
      nonce = await this.provider.getTransactionCount( senderAddress, 'pending');
      // Send transaction
      return await this.contract.multisendToken(
          tokenAddress,
          recipients,
          amountsInWei,
          {
              value: fee,
              gasLimit,
              maxFeePerGas,
              maxPriorityFeePerGas: maxPriorityFee,
              nonce
          }
      );
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}
  async getTransactionStatus(txHash: string): Promise<ethers.TransactionReceipt | null> {
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }
}