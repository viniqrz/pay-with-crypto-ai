import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ThemingService {
  private readonly logger = new Logger(ThemingService.name);
  private openai: OpenAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn('OPENAI_API_KEY not found. Using mock Theming engine.');
    }
  }

  async generateTheme(prompt: string): Promise<any> {
    this.logger.log(`Generating theme for prompt: "${prompt}"`);

    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `You are a UI Design Expert. Generate a Tailwind CSS theme configuration JSON based on the user's description. 
              Output strictly valid JSON with these keys: "primary" (hex), "background" (hex), "text" (hex), "radius" (string, e.g. "0.5rem"), "font" (string, e.g. "Inter").`
            },
            { role: "user", content: prompt }
          ],
          model: "gpt-3.5-turbo",
          response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        return JSON.parse(content || '{}');
      } catch (error) {
        this.logger.error('OpenAI API failed', error);
        // Fallback to mock if API fails
      }
    }

    // Mock Response (Generative Logic without LLM)
    return this.mockGenerate(prompt);
  }

  private mockGenerate(prompt: string) {
    const p = prompt.toLowerCase();

    const themes: Record<string, any> = {
      cyberpunk: {
        primary: '#ff00ff',
        background: '#09090b',
        text: '#00ffff',
        radius: '0px',
        font: 'Orbitron',
      },
      luxury: {
        primary: '#D4AF37',
        background: '#0a0a0a',
        text: '#f5f5f5',
        radius: '0.25rem',
        font: 'Playfair Display',
      },
      forest: {
        primary: '#22c55e',
        background: '#064e3b',
        text: '#ecfdf5',
        radius: '1rem',
        font: 'Outfit',
      },
      sunset: {
        primary: '#f97316',
        background: '#450a0a',
        text: '#ffedd5',
        radius: '2rem',
        font: 'Plus Jakarta Sans',
      },
      ocean: {
        primary: '#0ea5e9',
        background: '#082f49',
        text: '#f0f9ff',
        radius: '0.75rem',
        font: 'Inter',
      },
      lavender: {
        primary: '#a855f7',
        background: '#2e1065',
        text: '#faf5ff',
        radius: '1.5rem',
        font: 'Manrope',
      },
      minimalist: {
        primary: '#000000',
        background: '#ffffff',
        text: '#000000',
        radius: '0rem',
        font: 'Inter',
      },
      nordic: {
        primary: '#88c0d0',
        background: '#2e3440',
        text: '#eceff4',
        radius: '0.5rem',
        font: 'Roboto',
      },
    };

    // Keyword matching
    if (p.includes('cyberpunk') || p.includes('neon')) return themes.cyberpunk;
    if (p.includes('luxury') || p.includes('gold') || p.includes('rich'))
      return themes.luxury;
    if (p.includes('forest') || p.includes('green') || p.includes('nature'))
      return themes.forest;
    if (p.includes('sunset') || p.includes('orange') || p.includes('warm'))
      return themes.sunset;
    if (p.includes('ocean') || p.includes('blue') || p.includes('water'))
      return themes.ocean;
    if (p.includes('lavender') || p.includes('purple') || p.includes('soft'))
      return themes.lavender;
    if (p.includes('minimal') || p.includes('clean') || p.includes('white'))
      return themes.minimalist;
    if (p.includes('nordic') || p.includes('cold') || p.includes('snow'))
      return themes.nordic;

    // Random fallback
    const themeKeys = Object.keys(themes);
    const randomKey = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    this.logger.log(
      `No keyword match for "${prompt}". Returning random theme: ${randomKey}`,
    );
    return themes[randomKey];
  }
}
