import { IsNumber } from "class-validator";

export class LatLng {
    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;
}