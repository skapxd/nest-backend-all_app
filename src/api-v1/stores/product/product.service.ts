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

  async create(productDto: ProductStoreDto, req: Request) {

    try {

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

        if (_productDto.name) {

          product.nameProductStore = _productDto.name;
        }

        if (_productDto.price) {

          product.priceProductStore = _productDto.price;
        }

        if (_productDto.quantity) {

          product.quantityProductStore = _productDto.quantity;
        }

        if (_productDto.availability) {

          product.availabilityProductStore = _productDto.availability;
        }

        if (_productDto.category) {

          product.categoryProductStore = _productDto.category;
        }

        if (_productDto.urlImageProductStore) {

          product.urlImageProductStore = _productDto.urlImageProductStore
        }

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



  async deleteGroupProducts(ids: string[], req: Request) {

    const storeID: { phone?: string } = req['user'];


    try {
      const ifStore = await this.storeRepository.findOne({
        where: {
          id: storeID.phone
        }
      })

      if (!ifStore) {
        throw new Error("Store don't exist");

      }

      const deleteProductOfStoreEntity = () => {
        const newStore = new StoreEntity()
        newStore.productsStore = ifStore.productsStore.filter((value, index, arr) => {
          // Return elements that not in ids 
          if (!ids.includes(value)) {
            return value;
          }
        })
        this.storeRepository.update(ifStore, newStore);
      }

      const deleteProductOfProductEntity = () => {

        ids.forEach((e) => {

          this.productStoreRepository.delete({
            id: e,
          })
        })
      }


      deleteProductOfStoreEntity()
      deleteProductOfProductEntity()

      return {
        success: true,
      }

    } catch (error) {

      return {
        success: false,
        class: 'ProductService - deleteGroupProducts',
        error: error.message
      }
    }
  }

}
