import { Body, Controller, Get, Post, Req, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GeoCodingService } from '../api-v1/geo_coding/geo_coding.service';
import { VerifyPhoneCodeDto } from './dto/verify_phone_code.dto';
import { CreatePhoneCodeDto } from './dto/create_phone_code.dto';
import { CustomValidationPipe } from '../pipes/custom_error.pipe';
import { JwtAuthGuard } from './jwt_auth.guard';

@Controller()
export class AuthController {

  constructor(
    private authService: AuthService,
    private latlngToAddressService: GeoCodingService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('/set-user-name')
  async setUserName(@Req() req, @Body() body) {
    return this.authService.setUserName(body, req)
  }


  @Post('/create-phone-code')
  createPhoneCode(
    @Body(new CustomValidationPipe()) createPhoneCodeDto: CreatePhoneCodeDto
  ) {
    return this.authService.createPhoneCode(createPhoneCodeDto)
  }

  @Post('/verify-phone-code')
  verifyPhoneCode(
    @Body(new CustomValidationPipe()) verifyPhoneCodeDto: VerifyPhoneCodeDto
  ) {
    return this.authService.verifyPhoneCode(verifyPhoneCodeDto);
  }
}
