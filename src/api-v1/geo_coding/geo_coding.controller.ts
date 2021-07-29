import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GeoCodingService } from './geo_coding.service';
import { CustomValidationPipe } from '../../pipes/custom_error.pipe';
import { GetGeoCoding } from './dto/get_geo_coding.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';

@Controller()
export class GeoCodingController {

    constructor(
        private readonly geoService: GeoCodingService
    ){}

    @Get()
    async getGeoCoding(
        @Query( new CustomValidationPipe() ) params: GetGeoCoding
    ){

        try {
            const res = await this.geoService.latLngToAddress({
                lat: params.lat,
                lng: params.lng,
            })

            return {
                success: true,
                location: res,
            }
        } catch (error) {
            
            return {
                success: false,
            }
        }
    }
}
