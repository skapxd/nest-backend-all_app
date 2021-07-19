import { Users } from "../entities/user.entity"

export class CreateUserDto implements Users {

    phone: string
    
    lastAccessDateUser?: string
    
    createDateUser?: any
    
    tokenFCM?: string

    smsCode: string

    country?: string
    department?: string
    city?: string
}
