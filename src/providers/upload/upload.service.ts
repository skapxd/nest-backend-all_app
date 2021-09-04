import { Injectable } from '@nestjs/common';
import { rejects } from 'assert';
import * as fs from "fs";
import { v4 } from "uuid";

@Injectable()
export class UploadService {

    private prodDomain = 'https://all-app.herokuapp.com'
    private devDomain = 'http://localhost:3000'

    async saveInServer(img: Express.Multer.File): Promise<object> {

        // return new Promise((res, rej) => {

        if (img.size > 1e6) {
            return {
                success: false,
                error: 'Image must be less than 1MB',
                file: 'UploadService'
            }
            // rej('Image must be less than 1MB')
        }

        const extension = img.originalname.split('.').reverse()[0]

        const name = `${v4()}.${extension}`

        fs.writeFile(
            `public/uploads/${name}`,
            img.buffer,
            (err) => {
                // rej(err)
            }
        )

        // res(`${this.prodDomain}/uploads/${name}`)
        return {
            success: true,
            urlImage: `${this.prodDomain}/uploads/${name}`

        }
        // })
    }
}
