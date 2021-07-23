
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { UserCreateEntity } from './create.entity';


@Entity()
export class UserEntity {

    @ObjectIdColumn()
    id?: string;
    
    @Column()
    name?: string;

    @Column()
    urlPhoto?: string;

    @Column()
    phone: string;

    @Column()
    lastAccessDateUser?: string;

    @Column()
    tokenFCM?: string;

    
    @Column(type => UserCreateEntity)
    create?: UserCreateEntity


}

