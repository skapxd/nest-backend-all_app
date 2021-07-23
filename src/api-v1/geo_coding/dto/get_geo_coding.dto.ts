import { IsDefined, IsString } from 'class-validator';
export class GetGeoCoding {
    @IsString()
    // @IsDefined()
    lat: string;

    @IsString()
    lng: string;
}