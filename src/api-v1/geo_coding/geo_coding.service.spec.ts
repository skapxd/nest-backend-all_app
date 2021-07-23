import { Test, TestingModule } from '@nestjs/testing';
import { GeoCodingService } from './geo_coding.service';

describe('LatlngToAddressService', () => {
  let service: GeoCodingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoCodingService],
    }).compile();

    service = module.get<GeoCodingService>(GeoCodingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
