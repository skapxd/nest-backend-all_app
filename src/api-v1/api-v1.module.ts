import { Module } from '@nestjs/common';
import { ApiV1Service } from './api-v1.service';
import { ApiV1Controller } from './api-v1.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,

  ],
  controllers: [ApiV1Controller],
  providers: [ApiV1Service],
  exports: [UsersModule]
})
export class ApiV1Module { }
