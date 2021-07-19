import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/decorator/skip_auth';
import { AuthService } from './auth.service';
import { LatlngToAddressService } from '../latlng-to-address/latlng-to-address.service';

@Controller()
export class AuthController {

    constructor(
        private authService: AuthService,
        private latlngToAddressService: LatlngToAddressService
    ){}


    @Get('/get')
    get(){
      console.log('object');
      return this.latlngToAddressService.latLngToAddress({
        lat: '6.028305',
        lng: '-75.4358883'
      })
    }

    @Post('/create-phone-code')
    createPhoneCode(
      @Body() data: any
    ) {
      return this.authService.createPhoneCode(data['phone'])
    }
    
    @Post('/verify-phone-code')
    async verifyPhoneCode(
      @Body() data: any
    ) {
      return this.authService.verifyPhoneCode({
        smsCode: data['smsCode'],
        phone: data['phone'],
      });
    }
}
