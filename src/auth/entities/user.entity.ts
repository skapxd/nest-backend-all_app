// import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
export class Users {

    // @PrimaryGeneratedColumn()
    uid?: string;

    // @Column()
    phone: string

    // @Column({
    //     default: '',
    // })
    tokenFCM?: string

    // @Column({
    //     default: '',
    // })
    name?: string

    // @Column({
    //     default: '',
    // })
    urlPhoto?: string

    // @Column({
    //     default: '',
    // })
    smsCode?: string


    // @Column({type: 'datetime', default: '2021-07-05 11:11:45.911735'})
    codeExpire?: any

    // @CreateDateColumn({})
    createDateUser?: any


    // @Column({
    //     type: 'datetime', default: '2021-07-05 11:11:45.911735'
    // })
    lastAccessDateUser?: Date

}
