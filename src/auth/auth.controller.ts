import { Body, Controller, Get, Post, UseFilters, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GeoCodingService } from '../geo_coding/geo_coding.service';
import { VerifyPhoneCodeDto } from './dto/verify_phone_code.dto';
import { CreatePhoneCodeDto } from './dto/create_phone_code.dto';
import { CustomValidationPipe } from '../pipes/custom_error.pipe';

@Controller()
export class AuthController {

  constructor(
    private authService: AuthService,
    private latlngToAddressService: GeoCodingService
  ) { }


  // @Get('/get')
  // get() {
  //   console.log('object');
  //   return this.latlngToAddressService.latLngToAddress({
  //     lat: '6.028305',
  //     lng: '-75.4358883'
  //   })
  // }

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
