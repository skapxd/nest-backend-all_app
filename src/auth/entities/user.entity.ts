
export class CreateUserEntity {

    name?: string

    urlPhoto?: string

    phone: string

    lastAccessDateUser?: string

    tokenFCM?: string

    create?: {

        latLng?: {
            lat: string
            lng: string
        }

        country?: string
        department?: string
        city?: string

        createDateUser?: any

    }


}
