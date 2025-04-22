import { Test, TestingModule } from '@nestjs/testing';
import { MessagesCacheService } from './messages-cache.service';

describe('MessagesCacheService', () => {
  let service: MessagesCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesCacheService],
    }).compile();

    service = module.get<MessagesCacheService>(MessagesCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
