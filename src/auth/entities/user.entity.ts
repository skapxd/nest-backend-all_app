
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { UserCreateEntity } from './create.entity';


@Entity()
export class UserEntity {

    @ObjectIdColumn()
    id?: string;
    
    @Column()
    nameUser?: string;

    @Column()
    urlPhotoUser?: string;

    @Column()
    phoneUser: string;

    @Column()
    lastAccessDateUser?: string;

    @Column()
    tokenFCMUser?: string;
    

    
    @Column(type => UserCreateEntity)
    createUser?: UserCreateEntity
}

