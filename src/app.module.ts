import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiV1Module } from './api-v1/api-v1.module';
import { ConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { StoresModule } from './api-v1/stores/stores.module';
import { RouterModule } from 'nest-router';
import { routes } from './routes';
import { WhatsAppModule } from './providers/whatsapp/whatsapp.module';
import { ConfigModule } from './config/config.module';
import { LatlngToAddressModule } from './latlng-to-address/latlng-to-address.module';
@Module({
  imports: [
    RouterModule.forRoutes(routes),
    ApiV1Module,
    StoresModule,
    ConfigModule,
    WhatsAppModule,
    AuthModule,
    LatlngToAddressModule
  ],
  controllers: [AppController], 
  providers: [
    AppService,
  ],
})
export class AppModule { }
