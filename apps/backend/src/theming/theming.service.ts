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
    
    if (p.includes('cyberpunk') || p.includes('neon')) {
      return {
        primary: "#ff00ff",
        background: "#09090b",
        text: "#00ffff",
        radius: "0px",
        font: "Orbitron"
      };
    }
    
    if (p.includes('luxury') || p.includes('gold')) {
      return {
        primary: "#D4AF37",
        background: "#1a1a1a",
        text: "#f5f5f5",
        radius: "0.25rem",
        font: "Playfair Display"
      };
    }

    if (p.includes('forest') || p.includes('green')) {
      return {
        primary: "#228B22",
        background: "#F0FFF0",
        text: "#006400",
        radius: "1rem",
        font: "Nunito"
      };
    }

    // Default Blue
    return {
      primary: "#3b82f6",
      background: "#ffffff",
      text: "#1e293b",
      radius: "0.5rem",
      font: "Inter"
    };
  }
}
