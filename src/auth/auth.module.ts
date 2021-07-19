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
import { LatlngToAddressModule } from '../latlng-to-address/latlng-to-address.module';

@Module({
  imports: [
    ConfigModule, 
    FirebaseModule,
    WhatsAppModule,
    PassportModule,
    LatlngToAddressModule,
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
    // JwtModule
  ],
  controllers: [AuthController],
})
export class AuthModule { }
