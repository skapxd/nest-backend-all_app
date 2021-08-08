import { IsBoolean, IsDefined, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from "class-transformer";
import { LatLngDto } from '../../../models/dto/lat_lng.dto';

export class CreateStoreDto {
    
    // @IsDefined()
    // @Type(() => LatLngDto)
    // @ValidateNested()
    // latLng?: LatLngDto[];

    @IsString()
    category: string;
    

    @IsString()
    iconPathCategory?: string;

    @IsString()
    description: string;
    

    @IsString()
    nameStore?: string;

    urlImage?: string;

    visibility?: boolean;
    
    telegram?: string;
    
    phoneCall?: string;
    
    address?: string;
    
    whatsApp?: string;
}
