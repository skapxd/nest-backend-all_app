import { LatLng } from "src/models/lat_lng.dto";

export class CreateStoreEntity {

    phoneIdStore: string
    category: string;
    
    urlImage?: string

    nameStore?: string
    visibility?: boolean
    
    telegram?: string
    phoneCall?: string
    address?: string
    phoneWhatsApp?: string

    createData?: string
}
