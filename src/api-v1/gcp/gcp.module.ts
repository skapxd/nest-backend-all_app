import { Module } from '@nestjs/common';
import { GcpService } from './gcp.service';
import { GcpController } from './gcp.controller';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    ConfigModule
  ],
  controllers: [GcpController],
  providers: [GcpService],
  exports: [GcpService],
})
export class GcpModule {}
