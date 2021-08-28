import { Module } from '@nestjs/common';
import { GcpService } from './gcp.service';
import { GcpController } from './gcp.controller';
import { ConfigModule } from 'src/config/config.module';
import { UploadModule } from 'src/providers/upload/upload.module';

@Module({
  imports: [
    UploadModule,
    ConfigModule
  ],
  controllers: [GcpController],
  providers: [GcpService],
  exports: [GcpService],
})
export class GcpModule {}
