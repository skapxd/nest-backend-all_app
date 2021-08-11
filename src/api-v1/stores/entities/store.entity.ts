import { ContactStoreEntity } from "./contac_store.entity";
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { AddressStoreEntity } from "./address_store_entity";
import { ProductStoreEntity } from "../product/entities/product_store.entity";



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

    @Column()
    productsStore?: string[];
    
    @Column()
    productsCategoriesStore?: string[];
    
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

