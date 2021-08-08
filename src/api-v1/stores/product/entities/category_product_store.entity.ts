import { Column, Entity } from "typeorm"
import { ProductStoreEntity } from './product_store.entity'

@Entity()
export class CategoryProductStore {
    
    @Column()
    nameCategoryProductStore: string

    @Column(type => ProductStoreEntity)
    listProductStore: ProductStoreEntity[]
}