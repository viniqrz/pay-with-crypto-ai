import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('quote')
  async getQuote(@Body() body: { amount: number; currency: string }) {
    return this.paymentService.createQuote(body.amount, body.currency);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    // Expected format from Alchemy/Infura
    const { hash, from, to, value, asset } = body;
    return this.paymentService.processBlockchainWebhook(hash, from, to, value, asset);
  }
}
