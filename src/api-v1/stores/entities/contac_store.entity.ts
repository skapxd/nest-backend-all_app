import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm";


@Entity()
export class ContactStoreEntity {


    @ObjectIdColumn()
    id?: string;
    
    @Column()
    telegram: string;
    
    @Column()
    phoneCall: string;
    
    @Column()
    address: string;
    
    @Column()
    phoneWhatsApp: string;
}

