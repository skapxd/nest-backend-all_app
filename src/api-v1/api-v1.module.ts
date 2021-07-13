import { Module } from '@nestjs/common';
import { ApiV1Service } from './api-v1.service';
import { StoresModule } from './stores/stores.module';

@Module({
  imports: [
    StoresModule,
  ],
  providers: [ApiV1Service],

  exports: [
    StoresModule,
  ],
})
export class ApiV1Module { }
