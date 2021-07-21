import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from 'src/config/config.service';
import { WhatsAppModule } from 'src/providers/whatsapp/whatsapp.module';
import { FirebaseModule } from 'src/providers/firebase/firebase.module';
import { ConfigModule } from '../config/config.module';
import { AuthController } from './auth.controller';
import { GeoCodingModule } from '../geo_coding/geo_coding.module';

@Module({
  imports: [
    ConfigModule, 
    FirebaseModule,
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
