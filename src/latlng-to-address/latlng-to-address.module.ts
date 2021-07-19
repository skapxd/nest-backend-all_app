import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LatlngToAddressService } from './latlng-to-address.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [HttpModule, ConfigModule,],
  providers: [LatlngToAddressService],
  exports: [LatlngToAddressService]
})
export class LatlngToAddressModule { }
