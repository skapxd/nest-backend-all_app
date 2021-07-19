import { Test, TestingModule } from '@nestjs/testing';
import { LatlngToAddressService } from './latlng-to-address.service';

describe('LatlngToAddressService', () => {
  let service: LatlngToAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LatlngToAddressService],
    }).compile();

    service = module.get<LatlngToAddressService>(LatlngToAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
