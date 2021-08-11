import { Module } from '@nestjs/common';
import { ApiV1Service } from './api-v1.service';
import { StoresModule } from './stores/stores.module';
import { ProductModule } from './stores/product/product.module';
import { GcpModule } from './gcp/gcp.module';

@Module({
  imports: [
    StoresModule,
    ProductModule,
    GcpModule,
  ],
  providers: [ApiV1Service],

  exports: [
    StoresModule,
  ],
})
export class ApiV1Module { }
