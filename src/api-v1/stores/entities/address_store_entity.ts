import { LatLngEntity } from 'src/models/entity/lat_lng.entity';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { AddressEntity } from '../../../models/entity/address.entity';

@Entity()
export class AddressStoreEntity implements AddressEntity{
    
    @ObjectIdColumn()
    id?: string;
    
    @Column()
    city: string;
    
    @Column()
    country: string;
    
    @Column()
    department: string;

    @Column(type => LatLngEntity)
    latLngStore?: LatLngEntity;


}