import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiV1Module } from './api-v1/api-v1.module';
import { RouterModule } from 'nest-router';
import { routes } from './routes';
import { AuthModule } from './auth/auth.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return ({

          type: "mongodb",
          url: new ConfigService().mongoDbCredential,

          synchronize: true,
          logging: true,

          useNewUrlParser: true,
          useUnifiedTopology: true,
          autoLoadEntities: true
        })
      }
    }),
    AuthModule,
    ApiV1Module,
  ],
  controllers: [AppController,],
  providers: [
    AppService,
  ],
})
export class AppModule { }
