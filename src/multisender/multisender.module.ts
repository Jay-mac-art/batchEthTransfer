import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MultisenderService } from './multisender.service';
import { MultisenderController } from './multisender.controller';
import { MultisenderSDK } from '../providers/multisender.sdk';
import { ethers } from 'ethers';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    MultisenderService,
    {
      provide: 'MULTISENDER_SDK',
      useFactory: (configService: ConfigService) => {
        const provider = new ethers.JsonRpcProvider(configService.get<string>('RPC_URL_HOLESKY'));
        const signer = new ethers.Wallet(configService.get<string>('PRIVATE_KEY_WALLET') || "", provider);
        const contractAddress = configService.get<string>('CONTRACT_ADDRESS') || "";
        return new MultisenderSDK(provider, contractAddress, signer);
      },
      inject: [ConfigService],
    },
  ],
  controllers: [MultisenderController],
})
export class MultisenderModule {}
