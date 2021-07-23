import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { LatLngEntity } from './lat_lng.entity';


@Entity()
export class AddressEntity {

    @ObjectIdColumn()
    id?: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column()
    department: string;

    @Column(type => LatLngEntity)
    latLng?: LatLngEntity
}

