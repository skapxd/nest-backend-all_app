import { Column, Entity, ObjectIdColumn } from "typeorm";
import { LatLngEntity } from '../../models/entity/lat_lng.entity';

@Entity()
export class LatLngUserEntity implements LatLngEntity {

    
    @ObjectIdColumn()
    id?: string;
    
    @Column()
    lat: number | string;
    
    @Column()
    lng: number | string;
}

