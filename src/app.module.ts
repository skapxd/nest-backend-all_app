import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiV1Module } from './api-v1/api-v1.module';
import { RouterModule } from 'nest-router';
import { routes } from './routes';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    RouterModule.forRoutes(routes),
    AuthModule,
    ApiV1Module,
  ],
  controllers: [AppController], 
  providers: [
    AppService,
  ],
})
export class AppModule { }
