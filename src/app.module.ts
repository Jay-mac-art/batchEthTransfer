import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MultisenderModule } from './multisender/multisender.module';

@Module({
  imports: [MultisenderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
