import { Column, Entity } from "typeorm"

@Entity()
export class ProductStoreEntity {
    
    @Column()
    visibilityProductStore?: boolean

    @Column()
    nameProductStore?: string

    @Column()
    priceProductStore?: string

    @Column()
    quantityProductStore?: number

    @Column()
    urlImageProductStore?: string
}