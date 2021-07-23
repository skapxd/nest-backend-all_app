import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GeoCodingService } from './geo_coding.service';
import { ConfigModule } from '../../config/config.module';
import { GeoCodingController } from './geo_coding.controller';

@Module({
  imports: [HttpModule, ConfigModule,],
  providers: [GeoCodingService],
  exports: [GeoCodingService],
  controllers: [GeoCodingController]
})
export class GeoCodingModule { }
