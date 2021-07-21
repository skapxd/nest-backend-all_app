import { LatLng } from "src/models/lat_lng.dto"
import { IsBoolean, IsDefined, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from "class-transformer";

export class CreateStoreDto {
    
    @IsDefined()
    @Type(() => LatLng)
    @ValidateNested()
    latLng?: LatLng[];

    @IsString()
    category: string;
    
    @IsString()
    nameStore?: string;

    urlImage?: string;

    visibility?: boolean;
    
    telegram?: string;
    
    phoneCall?: string;
    
    address?: string;
    
    phoneWhatsApp?: string;
}
