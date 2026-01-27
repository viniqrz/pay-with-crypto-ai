import { Test, TestingModule } from '@nestjs/testing';
import { ThemingController } from './theming.controller';

describe('ThemingController', () => {
  let controller: ThemingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThemingController],
    }).compile();

    controller = module.get<ThemingController>(ThemingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
