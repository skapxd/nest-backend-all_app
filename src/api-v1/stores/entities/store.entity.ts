import { ContactStoreEntity } from "./contac_store.entity";
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { CategoryProductStore } from "../product/entities/category_product_store.entity";
import { AddressStoreEntity } from "./address_store_entity";



@Entity()
export class StoreEntity {

    @ObjectIdColumn()
    private _id?: string;

    @Column()
    id?: string;
    
    @Column()
    categoryStore?: string;
    
    @Column()
    iconPathCategoryStore?: string

    @Column()
    urlImageStore?: string;

    @Column(type => CategoryProductStore)
    categoryProductsStore?: CategoryProductStore[]
    
    @Column()
    descriptionStore?: string;

    @Column()
    nameStore?: string;

    @Column()
    visibilityStore?: boolean;

    @Column()
    createDataStore?: string;

    @Column(type => AddressStoreEntity)
    addressStore?: AddressStoreEntity[];

    @Column(type => ContactStoreEntity)
    contactStore?: ContactStoreEntity
}

