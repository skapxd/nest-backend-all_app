import { IsDefined, IsNotEmptyObject, IsNumber, IsObject, IsString, Length, ValidateNested } from 'class-validator';
import { LatLng } from '../../models/lat_lng.dto';
import { Type } from 'class-transformer';



export class VerifyPhoneCodeDto {

    @IsString()
    smsCode: string;

    @IsString()
    phone: string;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => LatLng)
    latLng: LatLng;

}
