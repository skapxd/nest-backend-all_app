import { Column, Entity, ObjectIdColumn } from "typeorm"

@Entity()
export class ProductStoreEntity {

    @ObjectIdColumn()
    private _idMongo?: string;
    
    @Column()
    id?: string; 

    @Column()
    availabilityProductStore?: boolean

    @Column()
    nameProductStore?: string

    @Column()
    priceProductStore?: string

    @Column()
    quantityProductStore?: string

    @Column()
    urlImageProductStore?: string

    @Column()
    categoryProductStore?: string
}