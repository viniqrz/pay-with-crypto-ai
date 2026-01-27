import { Test, TestingModule } from '@nestjs/testing';
import { ThemingService } from './theming.service';

describe('ThemingService', () => {
  let service: ThemingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThemingService],
    }).compile();

    service = module.get<ThemingService>(ThemingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
