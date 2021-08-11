import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from '../entities/store.entity';
import { FirebaseModule } from '../../../providers/firebase/firebase.module';
import { ProductStoreEntity } from './entities/product_store.entity';

@Module({
  imports:[
    FirebaseModule,
    TypeOrmModule.forFeature([
      ProductStoreEntity,
      StoreEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
 