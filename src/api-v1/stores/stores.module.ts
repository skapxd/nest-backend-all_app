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
import { MulterModule } from '@nestjs/platform-express';
import { GeoCodingModule } from 'src/api-v1/geo_coding/geo_coding.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LatLngEntity } from 'src/models/entity/lat_lng.entity';
import { ContactStoreEntity } from './entities/contac_store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreEntity
    ]),
    FirebaseModule,
    ConfigModule,
    GeoCodingModule,
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
  ],
  exports: [
    StoresService,
    JwtStrategy,
  ]
})
export class StoresModule {}
