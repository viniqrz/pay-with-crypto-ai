import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [BankService],
  controllers: [BankController],
  exports: [BankService], // Export so PaymentModule can use it
})
export class BankModule {}
