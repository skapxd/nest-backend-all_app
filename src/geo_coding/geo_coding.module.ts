import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GeoCodingService } from './geo_coding.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [HttpModule, ConfigModule,],
  providers: [GeoCodingService],
  exports: [GeoCodingService]
})
export class GeoCodingModule { }
