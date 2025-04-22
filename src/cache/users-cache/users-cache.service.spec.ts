import { Test, TestingModule } from '@nestjs/testing';
import { UsersCacheService } from './users-cache.service';

describe('UsersCacheService', () => {
  let service: UsersCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersCacheService],
    }).compile();

    service = module.get<UsersCacheService>(UsersCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
