import { Test, TestingModule } from '@nestjs/testing';
import { MultisenderService } from './multisender.service';

describe('MultisenderService', () => {
  let service: MultisenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultisenderService],
    }).compile();

    service = module.get<MultisenderService>(MultisenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
