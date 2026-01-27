import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PricingService } from '../pricing/pricing.service';
import { BankService } from '../bank/bank.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  // In-memory store for demo (should be Redis/DB)
  private quotes = new Map<string, any>();

  constructor(
    private pricingService: PricingService,
    private bankService: BankService,
  ) {}

  async createQuote(amountBrl: number, cryptoCurrency: string) {
    // 1. Risk Analysis
    const riskScore = await this.pricingService.getRiskScore(cryptoCurrency);
    
    // Safety Circuit Breaker
    if (riskScore > 0.9) {
      throw new BadRequestException('Market too volatile. Quotes paused.');
    }

    // 2. Pricing
    const exchangeRate = await this.pricingService.getExchangeRate(cryptoCurrency);
    const spread = await this.pricingService.getSmartSpread(riskScore);
    
    // Calculate final crypto amount: (Fiat / Rate) * (1 + Spread)
    const rawCryptoAmount = amountBrl / exchangeRate;
    const finalCryptoAmount = rawCryptoAmount * (1 + spread);

    const quoteId = `Q-${Date.now()}`;
    const quote = {
      quoteId,
      amountBrl,
      cryptoCurrency,
      exchangeRate,
      spread,
      finalCryptoAmount,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      depositAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Treasury Wallet
    };

    this.quotes.set(quoteId, quote);
    this.logger.log(`Quote created: ${JSON.stringify(quote)}`);
    
    return quote;
  }

  // Webhook called by Blockchain Indexer (Alchemy/Graph)
  async processBlockchainWebhook(txHash: string, from: string, to: string, amount: string, currency: string) {
    this.logger.log(`Blockchain Webhook received: ${txHash} | ${amount} ${currency}`);

    // In a real app, match tx to quote via memo or exact amount logic.
    // Here we assume it matches the most recent quote for demo.
    
    // 1. Verify Payment
    this.logger.log('Verifying transaction on-chain...');
    
    // 2. Instant Settlement (Float)
    // We send BRL immediately, even before selling the Crypto
    const pixKey = "user-cpf-key"; // Retrieved from User DB associated with this quote
    const amountBrl = 100.00; // Mock amount from the matched quote
    
    const payoutId = await this.bankService.sendPix(amountBrl, pixKey, "John Doe");
    await this.bankService.logFiatMovement(payoutId, amountBrl);

    // 3. Trigger Liquidation (Async Job)
    this.triggerLiquidation(amount, currency);

    return { status: 'settled', payoutId };
  }

  private async triggerLiquidation(amount: string, currency: string) {
    this.logger.log(`[LIQUIDATION BOT] Selling ${amount} ${currency} on Binance...`);
    // Connects to CCXT -> Sell Market Order
  }
}
