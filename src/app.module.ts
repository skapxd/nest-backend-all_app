import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiV1Module } from './api-v1/api-v1.module';
import { RouterModule } from 'nest-router';
import { routes } from './routes';
import { AuthModule } from './auth/auth.module';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    
    TypeOrmModule.forRoot({
      type: "mongodb",
      url: 'mongodb+srv://skapxd:601MXVAiiAb5@cluster0.qwcwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',

      "synchronize": true,
      "logging": true,

      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoLoadEntities: true

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
