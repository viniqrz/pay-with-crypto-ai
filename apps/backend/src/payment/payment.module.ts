import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PricingModule } from '../pricing/pricing.module';
import { BankModule } from '../bank/bank.module';

@Module({
  imports: [PricingModule, BankModule],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
