import { Injectable } from '@nestjs/common';
import { ConfigService } from "src/config/config.service";
import { Storage } from "@google-cloud/storage";
import { v4 as uuid4 } from "uuid";
import { Request } from "express";


@Injectable()
export class GcpService {

    constructor(
        private env: ConfigService,
        
    ) { }

    private storage = new Storage({
        keyFile: this.env.gcpCredential,
        projectId: this.env.gcpProjectId,
    })

    private bucket = this.storage.bucket('images_of_store_and_users');


    public async uploadFile(image: Express.Multer.File, req: Request) {

        const id: { phone?: string } = req['user'];


        const v4 = uuid4()

        const extension = image.originalname.split('.').reverse()[0]

        const  name = `${id.phone}/${v4}.${extension}`;
        
        console.log(name);
        
        const file = this.bucket
            .file(name )

        try {

            await file.save(image.buffer, {
                public: true,
                configPath: image.mimetype
            })

            return {
                success: true,
                urlImage: file.publicUrl()
            }

        } catch (error) {

            return {
                success: false,
                class: 'GcpService',
                error: error.message
            }
        }

    }

}
