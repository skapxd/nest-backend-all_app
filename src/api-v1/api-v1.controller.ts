import { Controller } from '@nestjs/common';
import { ApiV1Service } from './api-v1.service';

@Controller('api-v1')
export class ApiV1Controller {
  constructor(private readonly apiV1Service: ApiV1Service) {}
}
