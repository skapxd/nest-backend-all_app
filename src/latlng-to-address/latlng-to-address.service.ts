import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class LatlngToAddressService {

    // urlBase: string = 

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
    ) {
        // this.httpService.axiosRef.options(
        //     'https://maps.googleapis.com'
        // )
    }

    async latLngToAddress({
        lat,
        lng,
    }) {

        const axiosResponse = await this.httpService.axiosRef.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                'key': this.config.geoCodingToken,
                'latlng': `${lat},${lng}`,
            }
        })

        const res = axiosResponse.data

        console.log(res);


    }
}
