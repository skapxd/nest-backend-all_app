// TODO: Send Push Notification with FCM
import * as fs from "fs";
import * as admin from "firebase-admin";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "src/config/config.service";

@Injectable()
export class FirebaseService {



    constructor(
        private configService: ConfigService,
    ){
        this.setCredential()
    }

    public get fireStore(){
        return admin.firestore();
    }

    public get storage(){
        const storage = admin.storage().bucket(); 
        
        // storage.
        return storage;
    }
    

    setCredential(){

        admin.initializeApp({
            credential: admin.credential.cert(
                require(this.configService.firebaseCredentials)
            ),
            storageBucket: this.configService.storageBucket
        });

    }


}
