import { Module } from '@nestjs/common';
import { ThemingService } from './theming.service';
import { ThemingController } from './theming.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ThemingService],
  controllers: [ThemingController]
})
export class ThemingModule {}
