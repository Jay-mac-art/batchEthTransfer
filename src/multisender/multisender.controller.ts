import { Controller, Post, Body, Get, Param, HttpException, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { MultisenderService } from './multisender.service';
import { SendEthBatchDto, SendTokenBatchDto } from './dto/multisender.dto';


@Controller('multisender')
export class MultisenderController {
  constructor(private readonly multisenderService: MultisenderService) {}

  @Post('send-eth')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendEthBatch(@Body() sendEthBatchDto: SendEthBatchDto): Promise<{ txHash: string }> {
    try {
      const { batch } = sendEthBatchDto;
      const recipients = batch.map(item => item.recipient);
      const amounts = batch.map(item => item.amount);
      const txHash = await this.multisenderService.sendEthBatch(recipients, amounts);
      return { txHash };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('send-token')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendTokenBatch(@Body() sendTokenBatchDto: SendTokenBatchDto): Promise<{ txHash: string }> {
    try {
      const { tokenAddress, batch } = sendTokenBatchDto;
      const recipients = batch.map(item => item.recipient);
      const amounts = batch.map(item => item.amount);
      const txHash = await this.multisenderService.sendTokenBatch(tokenAddress, recipients, amounts);
      return { txHash };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('tx-status/:txHash')
  async getTransactionStatus(@Param('txHash') txHash: string): Promise<any> {
    try {
      return await this.multisenderService.getTransactionStatus(txHash);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}