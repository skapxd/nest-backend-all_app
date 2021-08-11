// TODO: Send Push Notification with FCM
import * as admin from "firebase-admin";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "src/config/config.service";
import { Storage } from "@google-cloud/storage";
import { v4 as uuid4 } from "uuid";
import { join } from "path";

// interface UploadFileI {
//     file: Express.Multer.File;
//     name: string;
// }

@Injectable()
export class FirebaseService {

    keyFile = 'env/dev_firebase.json'
    // keyFile = join(__dirname + '../../../../' + 'env/dev_firebase.json')

    private storage = new Storage({
        keyFile: this.keyFile,
        projectId: "all-app-319600",
    });

    private bucket = this.storage.bucket('images_of_store_and_users');


    constructor(
        private configService: ConfigService,
    ) {
        this.setCredential()
    }

    public async uploadFile({
        file: data,
        user
    }: {
        file: Express.Multer.File,
        user: string
    }): Promise<string> {

        const v4 = uuid4()

        const file = this.bucket
            .file(`${user}/${v4}${data.originalname}`)

        return new Promise(async (resolve, reject) => {

            try {

                await file.save(data.buffer, {
                    public: true,
                    configPath: data.mimetype
                })

                resolve(file.publicUrl());

            } catch (error) {
                console.log(`Ocurrio un error en la subida del archivo:`);
                console.log(error);
                reject(error)
            }
        });
    }

    public get storageDeprecated() {
        const storage = admin.storage().bucket();

        // storage.
        return storage;
    }

    public get admin() {
        return admin;
    }


    setCredential() {

        admin.initializeApp({
            credential: admin.credential.cert(
                require(this.configService.firebaseCredentials)
            ),
            storageBucket: this.configService.storageBucket
        });

    }


}
