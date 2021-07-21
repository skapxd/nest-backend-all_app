import { IsNumber, IsString } from 'class-validator';


export class FindAllStoreDto {

    category: string;

    @IsString()
    lat: string;
    
    @IsString()
    lng: string;
}