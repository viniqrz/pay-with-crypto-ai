import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);

  // Simulates a risk check based on market volatility
  // In a real app, this would query an ML model or Order Book depth
  async getRiskScore(currency: string): Promise<number> {
    // Random risk score between 0 and 1
    // Higher means riskier (high volatility)
    const volatility = Math.random(); 
    this.logger.log(`Analyzing volatility for ${currency}: ${volatility.toFixed(2)}`);
    
    return volatility;
  }

  // Smart Spread: dynamic fee based on risk
  async getSmartSpread(riskScore: number): Promise<number> {
    const baseFee = 0.01; // 1%
    const riskPremium = riskScore * 0.05; // Up to 5% extra if super risky
    return baseFee + riskPremium;
  }

  async getExchangeRate(pair: string): Promise<number> {
    // Mock exchange rates
    // ETH/BRL ~ 15000, USDC/BRL ~ 5.0
    if (pair.includes('ETH')) return 15000 + (Math.random() * 100);
    if (pair.includes('USDC')) return 5.0 + (Math.random() * 0.05);
    return 1.0;
  }
}
