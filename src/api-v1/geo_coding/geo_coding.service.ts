import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { GeoCodingI } from './geo_coding.model';
import { AddressEntity } from '../../models/entity/address.entity';

interface LatLngToAddressI {
    lat: number | string 
    lng: number | string 
}


@Injectable()
export class GeoCodingService {

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
    ) {
        this.httpService.axiosRef.defaults.baseURL = 'https://maps.googleapis.com/maps/api'
        this.httpService.axiosRef.defaults.params = { 'key': this.config.geoCodingKey }
    }

    async latLngToAddress(latLng: LatLngToAddressI): Promise<AddressEntity> {

        try {

            const axiosResponse = await this.httpService.axiosRef.get('/geocode/json', {
                params: { 'latlng': `${latLng.lat},${latLng.lng}` }
            })

            const res: GeoCodingI = axiosResponse.data

            const [country, department, city,  ] = res.results[0].formatted_address
                .split(',').map((e) => {

                    return e.replace(' ', '')
                }).reverse()

            return {
                city,
                department,
                country
            }
        } catch (error) {

            return {
                city: '',
                department: '',
                country: ''
            }
        }



    }
}
