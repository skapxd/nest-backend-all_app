// TODO: Send Push Notification with FCM
import * as fs from "fs";
import * as admin from "firebase-admin";
import { Injectable } from '@nestjs/common';
// import { ConfigService } from '../../config/config.service';

@Injectable()
export class FirebaseService {


    private serviceAccount: string;

    constructor(){
        this.setCredential()
    }

    public get fireStore(){
        return admin.firestore();
    }
    

    setCredential(){


        if (fs.existsSync('env/dev_firebase.json')) {

            this.serviceAccount = require("../../../env/dev_firebase.json");
            

        } else {

            this.serviceAccount = require("../../../env/prod_firebase.json");

        }

        admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount),
        });

    }


}
