import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/store.dto';
import { FirebaseService } from '../../providers/firebase/firebase.service';
import { Request } from "express";
import { ConfigService } from '../../config/config.service';
import { StoreEntity } from './entities/store.entity';
import { GeoCodingService } from 'src/api-v1/geo_coding/geo_coding.service';
import { FindAllStoreDto } from './dto/find_all_store.dto';
import { LatLngEntity } from 'src/models/entity/lat_lng.entity';
import { AddressEntity } from 'src/models/entity/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetLocationsDto } from './dto/set_locations.dto';
import { AddressStoreEntity } from './entities/address_store_entity';

@Injectable()
export class StoresService {

  constructor(
    private readonly gcp: FirebaseService,
    private readonly firebase: FirebaseService,
    private readonly config: ConfigService,
    private readonly geoCodingService: GeoCodingService,

    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,
  ) { }


  async createStore(
    createStoreDto: CreateStoreDto,
    req: Request,
  ) {

    try {


      // User extracted from jwt
      const storeID: { phone?: string } = req['user'];

      const saveStoreEntity = async () => {


        // Create storeEntity
        const storeEntity: StoreEntity = {
          id: storeID.phone,
          urlImageStore: createStoreDto.urlImage,
          descriptionStore: createStoreDto.description,
          nameStore: createStoreDto.nameStore,
          categoryStore: createStoreDto.category,
          visibilityStore: createStoreDto.visibility,
          iconPathCategoryStore: createStoreDto.iconPathCategory,
          contactStore: {
            phoneCall: createStoreDto.phoneCall,
            whatsApp: createStoreDto.whatsApp,
            telegram: createStoreDto.telegram,
          },
        }



        // Verify store exist 
        const ifExistStore = await this.storeRepository.findOne({
          where: {
            id: storeID.phone
          }
        })

        console.log(`ifExistStore: ${ifExistStore}`);

        // If store don't exist, add Date create
        const now = new Date();
        if (!ifExistStore) {
          storeEntity.createDataStore = now.toString()
          // Saving storeEntity in MongoDB
          this.storeRepository.save(storeEntity);
        } else {
          this.storeRepository.update(ifExistStore, storeEntity);
        }
      }



      saveStoreEntity();


      return {
        success: true,
      }

    } catch (error) {

      return {
        success: false,
        error: error.message,
        functionName: "createStore"
      }
    }
  }

  async setProductCategories(body: string[], req: Request) {

    try {
      
      // User extracted from jwt
      const storeID: { phone?: string } = req['user'];

      const store = new StoreEntity();
      store.productsCategoriesStore = body;

      const ifStore = await this.storeRepository.findOne({
        where: {
          id: storeID.phone
        }
      })

      if (!ifStore) {
        
        throw new Error("Store don't exist");
      }

      this.storeRepository.update(ifStore, store)

      return {
        success: true
      }
    } catch (error) {
      
      return {
        success: false,
        error: error.message
      }
    }
  }

  async findAll(findAllStoreDto: FindAllStoreDto) {

    try {

      let allStores: StoreEntity[];
      let addressModel: AddressEntity;


      // if the AddressModel does not come in Query, get AddressModel of Google's GeoCoding API
      if (!findAllStoreDto.city &&
        !findAllStoreDto.department &&
        !findAllStoreDto.country) {
        addressModel = await this.geoCodingService.latLngToAddress({
          lat: findAllStoreDto.lat,
          lng: findAllStoreDto.lng
        })
      } else {
        addressModel = {
          city: findAllStoreDto.city,
          department: findAllStoreDto.department,
          country: findAllStoreDto.country,
        }
      }



      // If Category does not come in Query, Get All stores
      if (!findAllStoreDto.category) {
        allStores = await this.storeRepository.find({
          take: 10,
          skip: Number(findAllStoreDto.limit),
          where: {
            'addressStore.city': addressModel.city,
            'addressStore.department': addressModel.department,
            'addressStore.country': addressModel.country,
          },
        })

      } else {
        allStores = await this.storeRepository.find({
          take: 10,
          skip: Number(findAllStoreDto.limit),
          where: {
            'addressStore.city': addressModel.city,
            'addressStore.department': addressModel.department,
            'addressStore.country': addressModel.country,
            'categoryStore': findAllStoreDto.category
          }
        })
      }

      return {
        success: true,
        storesModel: allStores

      }

    } catch (error) {

      return {
        success: false,
        error: error.message
      }
    }


  }

  async findOne(id: string): Promise<StoreEntity | undefined> {

    try {

      const storeEntity = await this.storeRepository.findOne({
        where: {
          id: id
        }
      })


      if (!storeEntity) {

        throw new Error("Store don't exist");
      }

      return storeEntity;

    } catch (error) {

      return;
    }

  }


  removeLocationsStoreEntityFromStoreEntity(req: Request) {

    // User extracted from jwt
    const user: { phone?: string } = req['user'];


    // this.firebase.fireStore.collection(this.stores)
    //   .doc(user.phone)
    //   .update({
    //     address: this.firebase.admin.firestore.FieldValue.delete(),
    //     geoLocations: this.firebase.admin.firestore.FieldValue.delete()
    //   })


    return {
      success: true
    };
  }

  async setLocation(
    setLocationsDto: SetLocationsDto,
    req: Request,
  ) {
    try {

      // User extracted from jwt
      const storeID: { phone?: string } = req['user'];



      // Set LocationStoreEntity
      const setLocationStoreEntity = async (latLng: LatLngEntity) => {


        // Get AddressModel and set data in locationStoreEntity 
        const addressModel = await this.geoCodingService.latLngToAddress({
          lat: latLng.lat,
          lng: latLng.lng,
        })

        const tempLocationStoreEntity: AddressStoreEntity = {
          country: addressModel.country,
          department: addressModel.department,
          city: addressModel.city,
          latLngStore: {
            lat: latLng.lat,
            lng: latLng.lng,
          }
        }
        return tempLocationStoreEntity
      }


      // Save LocationStoreEntity
      const saveLocationStoreEntity = async () => {

        // Get List of AddressModelI
        const locationsList: AddressEntity[] = await Promise.all(
          setLocationsDto.latLng.map(
            async (latLng) => {

              return await setLocationStoreEntity(latLng);
            }
          )
        )

        const initStoreEntity: StoreEntity = {
          id: storeID.phone,
          addressStore: locationsList,
          contactStore: {
            phoneCall: '',
            whatsApp: '',
            telegram: '',
          },
          categoryStore: '',
          nameStore: '',
          visibilityStore: false,
        }

        const onlyLocationStoreEntity: StoreEntity = {
          addressStore: locationsList
        }

        // Verify store exist 
        const ifExistStore = await this.storeRepository.findOne({
          where: {
            id: storeID.phone
          }
        })

        // If store don't exist, add Date create
        const now = new Date();
        if (!ifExistStore) {
          initStoreEntity.createDataStore = now.toString()
          // Saving storeEntity in MongoDB
          this.storeRepository.save(initStoreEntity);
        } else {
          this.storeRepository.update(ifExistStore, onlyLocationStoreEntity);
        }

      }

      saveLocationStoreEntity();

      return {
        success: true,
      }

    } catch (error) {

      return {
        success: false,
        error: error.message,
        functionName: "setLocation"
      }
    }
  }

  async createProducto() {

  }
}
