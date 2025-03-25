import { Test, TestingModule } from '@nestjs/testing';
import { MultisenderController } from './multisender.controller';

describe('MultisenderController', () => {
  let controller: MultisenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MultisenderController],
    }).compile();

    controller = module.get<MultisenderController>(MultisenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
