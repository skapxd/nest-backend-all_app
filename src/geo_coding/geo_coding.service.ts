import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { GeoCodingI } from './geo_coding.model';

interface LatLngToAddressI {
    lat: number | string 
    lng: number | string 
}

export interface AddressModelI {
    city: string
    department: string
    country: string
    error?: string
}

@Injectable()
export class GeoCodingService {

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
    ) {
        this.httpService.axiosRef.defaults.baseURL = 'https://maps.googleapis.com/maps/api'
        this.httpService.axiosRef.defaults.params = { 'key': this.config.geoCodingToken }
    }

    async latLngToAddress(latLng: LatLngToAddressI): Promise<AddressModelI> {

        try {

            const axiosResponse = await this.httpService.axiosRef.get('/geocode/json', {
                params: { 'latlng': `${latLng.lat},${latLng.lng}` }
            })

            const res: GeoCodingI = axiosResponse.data

            const [, city, department, country] = res.results[0].formatted_address
                .split(',').map((e) => {

                    return e.replace(' ', '')
                })

            return {
                city,
                department,
                country
            }
        } catch (error) {

            return {
                error: error.message,
                city: '',
                department: '',
                country: ''
            }
        }



    }
}
