import { Column, Entity, ObjectIdColumn } from "typeorm";



@Entity()
export class LatLngEntity {

    
    @ObjectIdColumn()
    id?: string;
    
    @Column()
    lat: number | string;

    
    @Column()
    lng: number | string;
}

