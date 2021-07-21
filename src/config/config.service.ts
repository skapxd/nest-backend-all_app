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
  public geoCodingToken: string = process.env.GEO_CODING_TOKEN

  public setEnv() {

    // In case dev variables exist
    const dev = config({
      path: 'env/dev.env'
    })

    
    const prod = config({
      path: 'env/prod.env'
    })
  }

  public dbConnection(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    let extra

    if (process.env.DB_EXTRA !== 'undefine') {
      extra = {
        socketPath: process.env.DB_EXTRA
      }
    } else {
      extra = {}
    }

    return {

      type: 'mysql',
      // Blocked by ip, luckily
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,

      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,

      extra,

      autoLoadEntities: true,
      synchronize: true,
    }
  }
}