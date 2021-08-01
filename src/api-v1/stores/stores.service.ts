import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create_store.dto';
import { FirebaseService } from '../../providers/firebase/firebase.service';
import { Request } from "express";
import { v4 as uuid4 } from "uuid";
import { ConfigService } from '../../config/config.service';
import { StoreEntity } from './entities/store.entity';
import { GeoCodingService } from 'src/api-v1/geo_coding/geo_coding.service';
import { FindAllStoreDto } from './dto/find_all_store.dto';
import { LatLngEntity } from 'src/models/entity/lat_lng.entity';
import { AddressEntity } from 'src/models/entity/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetLocationsDto } from './dto/set_locations.dto';

@Injectable()
export class StoresService {

  constructor(
    private readonly firebase: FirebaseService,
    private readonly config: ConfigService,
    private readonly geoCodingService: GeoCodingService,

    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,
  ) { }

  async uploadLogo(
    file: Express.Multer.File,
    req: Request,
  ) {

    try {
      const v4 = uuid4()

      // User extracted from jwt
      const storeID: { phone?: string } = req['user'];

      const extension = file.originalname.split('.').reverse()[0];

      const pathImage = `${storeID.phone}/logo.${extension}`

      this.firebase.storage
        .file(pathImage)
        .save(file.buffer, {
          public: true,
          private: false,
          metadata: {
            metadata: {
              firebaseStorageDownloadTokens: v4,
            },
          },
        });

      const nameURI = encodeURIComponent(pathImage);


      const storeEntity = new StoreEntity()
      storeEntity.id = storeID.phone;
      storeEntity.urlImage = `https://firebasestorage.googleapis.com/v0/b/${this.config.storageBucket}/o/${nameURI}?alt=media&token=${v4}`


      // Verify store exist 
      const ifExistStore = await this.storeRepository.findOne({
        where: {
          id: storeID.phone
        }
      })


      if (!ifExistStore) {
        this.storeRepository.save(storeEntity);
      } else {
        this.storeRepository.update(ifExistStore, storeEntity);
      }


      return {
        success: true,
        urlImage: storeEntity.urlImage,
      }

    } catch (error) {

      return {
        success: false,
        error: error.message
      }
    }

  }

  async createStore(
    createStoreDto: CreateStoreDto,
    req: Request,
  ) {

    try {

      console.log(createStoreDto);


      // User extracted from jwt
      const storeID: { phone?: string } = req['user'];

      const saveStoreEntity = async () => {


        // Create storeEntity
        const storeEntity: StoreEntity = {
          iconPathCategory: createStoreDto.iconPathCategory,
          description: createStoreDto.description,
          id: storeID.phone,
          contact: {
            phoneCall: createStoreDto.phoneCall,
            whatsApp: createStoreDto.whatsApp,
            telegram: createStoreDto.telegram,
          },
          category: createStoreDto.category,
          nameStore: createStoreDto.nameStore,
          visibility: createStoreDto.visibility,
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
          storeEntity.createData = now.toString()
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
          where: {
            'address.city': addressModel.city,
            'address.department': addressModel.department,
            'address.country': addressModel.country,
          }
        })

      } else {
        allStores = await this.storeRepository.find({
          where: {
            'address.city': addressModel.city,
            'address.department': addressModel.department,
            'address.country': addressModel.country,
            'category': findAllStoreDto.category
          }
        })
      }

      return {
        success: true,
        allStores
      }

    } catch (error) {

      return {
        success: false,
        error: error.message
      }
    }


  }

  async findOne(id: string): Promise<StoreEntity | undefined>  {

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

        const tempLocationStoreEntity: AddressEntity = {
          country: addressModel.country,
          department: addressModel.department,
          city: addressModel.city,
          latLng: {
            lat: latLng.lat,
            lng: latLng.lng,
          }
        }
        return tempLocationStoreEntity
      }


      // Save LocationStoreEntity
      const saveLocationStoreEntity = async () => {

        // Get List of AddresModelI
        const locationsList: AddressEntity[] = await Promise.all(
          setLocationsDto.latLng.map(
            async (latLng) => {

              return await setLocationStoreEntity(latLng);
            }
          )
        )

        const initStoreEntity: StoreEntity = {
          id: storeID.phone,
          address: locationsList,
          contact: {
            phoneCall: '',
            whatsApp: '',
            telegram: '',
          },
          category: '',
          nameStore: '',
          visibility: false,
        }

        const onlyLocationStoreEntity: StoreEntity = {
          address: locationsList
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
          initStoreEntity.createData = now.toString()
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
}
