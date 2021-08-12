import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { FirebaseModule } from '../../providers/firebase/firebase.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../../config/config.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ConfigModule } from 'src/config/config.module';
import { GeoCodingModule } from 'src/api-v1/geo_coding/geo_coding.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './entities/store.entity';
import { ProductModule } from './product/product.module';
import { ProductStoreEntity } from './product/entities/product_store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductStoreEntity,
      StoreEntity,
    ]),
    FirebaseModule,
    ProductModule,
    ConfigModule,
    GeoCodingModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: new ConfigService().keyToken,
      }),
    }),
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
