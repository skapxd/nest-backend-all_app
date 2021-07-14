import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/decorator/skip_auth';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Public()
    @Post('/create-phone-code')
    createPhoneCode(
      @Body() data: any
    ) {
      return this.authService.createPhoneCode(data['phone'])
    }
    
    @Public()
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
