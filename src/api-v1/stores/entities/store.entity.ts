import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as  mongoose from 'mongoose';

import { LatLngEntity } from "src/models/entity/lat_lng.entity";
import { ContactStoreEntity } from "./contac_store.entity";
import { AddressEntity } from '../../../models/entity/address.entity';
import { Column, Entity, ObjectIdColumn } from 'typeorm';



@Entity()
export class StoreEntity {


    @ObjectIdColumn()
    private _id?: string;

    @Column()
    id?: string;
    
    @Column()
    category?: string;

    @Column()
    urlImage?: string;

    @Column()
    nameStore?: string;

    @Column()
    visibility?: boolean;

    @Column()
    createData?: string;

    @Column(type => AddressEntity)
    address?: AddressEntity[];

    @Column(type => ContactStoreEntity)
    contact?: ContactStoreEntity
}

