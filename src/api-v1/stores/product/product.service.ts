import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Any, In, Repository } from 'typeorm';
import { StoreEntity } from '../entities/store.entity';
import { ProductStoreDto } from './dto/product_store.dto';
import { ProductStoreEntity } from './entities/product_store.entity';
import { v4 as idv4 } from "uuid";
import { FirebaseService } from 'src/providers/firebase/firebase.service';

@Injectable()
export class ProductService {

  constructor(
    private readonly gcp: FirebaseService,

    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,

    @InjectRepository(ProductStoreEntity)
    private productStoreRepository: Repository<ProductStoreEntity>,
  ) { }


  async uploadImageProduct(
    file: Express.Multer.File,
    req: Request
  ) {

    const storeID: { phone?: string } = req['user'];

    try {

      const result = await this.gcp.uploadFile({
        user: storeID.phone,
        file: file,
      })

      return {
        success: true,
        urlImage: result
      }

    } catch (error) {

      return {
        success: false,
        error: error.message
      }

    }

  }

  async create(productDto: ProductStoreDto, req: Request) {

    try {

      // const storeID: { phone?: string } = {
      //   phone: '+57'
      // };
      const storeID: { phone?: string } = req['user'];


      // Verify store exist 
      const ifExistStore = await this.storeRepository.findOne({
        where: {
          id: storeID.phone
        }
      })

      if (!ifExistStore) {

        throw new Error("Store don't exist");
      }

      const saveInProductEntity = async (_productDto: ProductStoreDto): Promise<string> => {

        let product = new ProductStoreEntity();
        product.nameProductStore = _productDto.name;
        product.priceProductStore = _productDto.price;
        product.quantityProductStore = _productDto.quantity;
        product.availabilityProductStore = _productDto.availability;
        product.categoryProductStore = _productDto.category;
        
        if (!_productDto.id) {
          product.id = idv4();
          product = await this.productStoreRepository.save(product);
          return product.id;

        } else {
          const ifExistProduct = await this.productStoreRepository.findOne({
            where: {
              id: _productDto.id
            }
          });
          this.productStoreRepository.update(ifExistProduct, product);
          return _productDto.id;
        }
      }

      const saveProductListInStoreEntity = async (_store: StoreEntity, _productId: string): Promise<string[]> => {

        const newStore = new StoreEntity();

        const setProduct = new Set(_store.productsStore || [])
        setProduct.add(_productId);

        newStore.productsStore = [...setProduct];

        await this.storeRepository.update(_store, newStore);

        return [...setProduct];
      }

      console.log('productId');
      
      const productId = await saveInProductEntity(productDto);

      console.log('productId');
      console.log(productId);

      const getListOfIdProductsIdentifiers = await saveProductListInStoreEntity(ifExistStore, productId);

      const getListProducts = await this.findByIds(getListOfIdProductsIdentifiers);

      return {
        success: true,
        listProduct: getListProducts,
      };

    } catch (error) {

      return {
        success: false,
        error: error.message
      }
    }

  }

  async findByIds(ids: string[]) {

    try {

      const products = await this.productStoreRepository.find({
        where: {
          id: { $in: ids }
          // id: { $in :['8d899157-cf6e-4ed8-83f9-612248b64427']}
          // id: Any(['8d899157-cf6e-4ed8-83f9-612248b64427'])
          // id: In(['8d899157-cf6e-4ed8-83f9-612248b64427'])
        }
      });

      return products;

    } catch (error) {

      return error.message
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
