import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BankService {
  private readonly logger = new Logger(BankService.name);

  constructor(private configService: ConfigService) {}

  async sendPix(amount: number, taxId: string, name: string): Promise<string> {
    const bankUrl = this.configService.get('BANK_API_URL');
    this.logger.log(`Initiating PIX to ${name} (${taxId}) for R$ ${amount.toFixed(2)} via ${bankUrl}`);

    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate Stark Bank success response
    const endToEndId = `E${Date.now()}RANDOM${Math.floor(Math.random() * 1000)}`;
    this.logger.log(`PIX Sent! EndToEndId: ${endToEndId}`);

    return endToEndId;
  }

  // Audit Logging (usually done via Interceptors/Middleware, but here simulating a method)
  async logFiatMovement(txId: string, amount: number) {
    this.logger.log(`[AUDIT] Transaction ${txId} moved BRL ${amount}`);
    // In real app, write to immutable ledger or separate audit DB
  }
}
