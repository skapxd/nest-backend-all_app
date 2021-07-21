
import { IsString, IsInt } from 'class-validator';

export class CreatePhoneCodeDto {

    @IsString()
    phone: string;
    
    // @IsString()
    smsCode: string;
}