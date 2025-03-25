import { Inject, Injectable } from '@nestjs/common';
import { MultisenderSDK } from '../providers/multisender.sdk'
import { ethers } from 'ethers';

@Injectable()
export class MultisenderService {
  constructor(@Inject('MULTISENDER_SDK') private readonly sdk: MultisenderSDK) {}

  async sendEthBatch(recipients: string[], amounts: string[]): Promise<string> {
    try {
      const tx = await this.sdk.sendEthBatch(recipients, amounts);
      return tx.hash;
    } catch (error) {
      throw new Error(`Failed to send ETH-batch: ${error.message}`);
    }
  }

  async sendTokenBatch(tokenAddress: string, recipients: string[], amounts: string[]): Promise<string> {
    try {
      const tx = await this.sdk.sendTokenBatch(tokenAddress, recipients, amounts);
      return tx.hash;
    } catch (error) {
      throw new Error(`Failed to send token batch: ${error.message}`);
    }
  }

  async getTransactionStatus(txHash: string): Promise<any> {
    try {
      return await this.sdk.getTransactionStatus(txHash);
    } catch (error) {
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }
}