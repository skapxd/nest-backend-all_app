import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { FirebaseModule } from '../../providers/firebase/firebase.module';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../../config/config.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    FirebaseModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: new ConfigService().keyToken,
      }),
    }),
    PassportModule,
  ],
  controllers: [StoresController],
  providers: [
    StoresService,
    JwtStrategy,
    // {
    //   provide: 'APP_GUARD',
    //   useClass: JwtAuthGuard,
    // },
  ]
})
export class StoresModule {}
