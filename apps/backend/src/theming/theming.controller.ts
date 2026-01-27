import { Controller, Post, Body } from '@nestjs/common';
import { ThemingService } from './theming.service';

@Controller('theme')
export class ThemingController {
  constructor(private readonly themingService: ThemingService) {}

  @Post('generate')
  async generateTheme(@Body() body: { prompt: string }) {
    return this.themingService.generateTheme(body.prompt);
  }
}
