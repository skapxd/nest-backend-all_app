import { IsNumber, IsString } from 'class-validator';


export class FindAllStoreDto {

    category?: string;

    lat?: string;
    lng?: string;

    city?: string;
    country?: string;
    department?: string
}