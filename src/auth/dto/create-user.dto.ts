import { Users } from "../entities/user.entity"

export class CreateUserDto implements Users {
    phone: string
    smsCode?: string
    codeExpire?: string
}
