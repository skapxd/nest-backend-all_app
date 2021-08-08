import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { LatLngEntity } from '../../models/entity/lat_lng.entity';
import { LatLngUserEntity } from './lat_lng_store.entity';

@Entity()
export class UserCreateEntity {

    @ObjectIdColumn()
    id?: string;

    @Column(type => LatLngUserEntity)
    latLngUser?: LatLngUserEntity;

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

