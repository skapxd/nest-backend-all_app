import { IsBoolean, IsString } from "class-validator";

export class ProductStoreDto {

    id: string;

    @IsBoolean()
    availability: boolean;
    
    @IsString()
    name: string;
    
    @IsString()
    price: string;
    
    @IsString()
    quantity: string;
    
    @IsString()
    category: string;
    
    @IsString()
    urlImageProductStore: string;
}
