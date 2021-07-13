import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

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
