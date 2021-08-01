import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { LatLngEntity } from '../../models/entity/lat_lng.entity';

@Entity()
export class UserCreateEntity {

    @ObjectIdColumn()
    id?: string;

    @Column(type => LatLngEntity)
    latLng?: LatLngEntity;

    @Column()
    country?: string;
    @Column()
    department?: string;
    @Column()
    city?: string;


    @Column()
    name?: string;

    @Column()
    createDateUser?: any;
}

