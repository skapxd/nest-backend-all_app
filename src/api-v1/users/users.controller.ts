import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }


  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Post('/create-phone-code')
  createPhoneCode(
    @Body() data: any
  ) {
    return this.authService.createPhoneCode(data['phone'])
  }

  // @UseGuards(LocalAuthGuard)
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
