import { IsString } from 'class-validator';
export class CreateStoreDto {

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
