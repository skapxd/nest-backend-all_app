import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from 'src/config/config.service';
import { WhatsAppModule } from 'src/providers/whatsapp/whatsapp.module';
import { ConfigModule } from '../config/config.module';
import { AuthController } from './auth.controller';
import { GeoCodingModule } from '../api-v1/geo_coding/geo_coding.module';

import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from '../api-v1/stores/stores.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),

    StoresModule,

    ConfigModule, 
    WhatsAppModule,
    PassportModule,
    GeoCodingModule,

    CacheModule.register(),
    
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: new ConfigService().keyToken,
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule { }
