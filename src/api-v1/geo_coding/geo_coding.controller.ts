import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GeoCodingService } from './geo_coding.service';
import { CustomValidationPipe } from '../../pipes/custom_error.pipe';
import { GetGeoCoding } from './dto/get_geo_coding.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class GeoCodingController {

    constructor(
        private readonly geoService: GeoCodingService
    ){}

    @Get()
    getGeoCoding(
        @Query( new CustomValidationPipe() ) params: GetGeoCoding
    ){
        return this.geoService.latLngToAddress({
            lat: params.lat,
            lng: params.lng,
        })
    }
}
