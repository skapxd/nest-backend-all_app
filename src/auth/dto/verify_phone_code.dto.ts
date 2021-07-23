import { IsDefined, IsNotEmptyObject, IsNumber, IsObject, IsString, Length, ValidateNested } from 'class-validator';
import { LatLngEntity } from '../../models/entity/lat_lng.entity';
import { Type } from 'class-transformer';
import { LatLngDto } from '../../models/dto/lat_lng.dto';



export class VerifyPhoneCodeDto {

    @IsString()
    smsCode: string;

    @IsString()
    phone: string;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => LatLngDto)
    latLng: LatLngDto;

}
