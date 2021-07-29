import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { config } from "dotenv";
import * as fs from "fs";

@Injectable()
export class ConfigService {

  public userMail: string = process.env.USER_MAIL;
  public passMail: string = process.env.PASS_MAIL;
  public keyToken: string = process.env.KEY_TOKEN;
  public port: string | number = process.env.PORT || 3000;
  public urlDatabaseFireStore: string = process.env.URL_DATABASE_FIRESTORE;
  public storageBucket: string = process.env.STORAGE_BUCKET;
  public firebaseCredentials: string = process.env.FIREBASE_JSON_CREDENTIAL;
  public geoCodingKey: string = process.env.GEO_CODING_KEY
  public mongoDbCredential: string = process.env.MONGO_DB_CREDENTIAL

  public setEnv() {

    // Important, the variable is not overwritten

    // If dev.env exist, set as environment
    config({
      path: 'env/dev.env'
    })

    // If dev.env don't exist, set prod.dev as environment
    config({
      path: 'env/prod.env'
    })
  }
}