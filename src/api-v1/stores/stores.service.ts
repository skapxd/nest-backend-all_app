import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create_store.dto';
import { FirebaseService } from '../../providers/firebase/firebase.service';
import { Request } from "express";
import { v4 as uuid4 } from "uuid";
import { ConfigService } from '../../config/config.service';
import { CreateStoreEntity } from './entities/create_store.entity';
import { GeoCodingService } from 'src/geo_coding/geo_coding.service';
import { FindAllStoreDto } from './dto/find_all_store.dto';
import { LatLng } from 'src/models/lat_lng.dto';
import { LocationStoreEntity } from './entities/location_store.entity';



@Injectable()
export class StoresService {

  private stores: string = 'stores'

  constructor(
    private readonly firebase: FirebaseService,
    private readonly config: ConfigService,
    private readonly geoCodingService: GeoCodingService
  ) {
    this.firebase.fireStore.settings({
      ignoreUndefinedProperties: true,

    })
  }

  async uploadLogo(
    file: Express.Multer.File,
    req: Request,
  ) {

    try {
      const v4 = uuid4()

      const user: { phone?: string } = req['user'];

      console.log(user);

      console.log(file);
      const extension = file.originalname.split('.').reverse()[0];
      console.log(extension);

      const pathImage = `${user.phone}/logo.${extension}`

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

      const urlImage = `https://firebasestorage.googleapis.com/v0/b/${this.config.storageBucket}/o/${nameURI}?alt=media&token=${v4}`

      console.log(urlImage);


      this.firebase.fireStore.collection(this.stores)
        .doc(user.phone)
        .set({ urlImage }, {
          merge: true
        });

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

  async createStore(
    createStoreDto: CreateStoreDto,
    req: Request,
  ) {

    try {


      // User extracted from jwt
      const store: { phone?: string } = req['user'];


      // Get AddressModel and Save storeEntity
      const saveLocationStoreEntity = async (latLng: LatLng, index: number) => {


        // Get AddressModel and set data in locationStoreEntity 
        const addressModel = await this.geoCodingService.latLngToAddress({
          lat: latLng.lat,
          lng: latLng.lng,
        })
        const locationStoreEntity: LocationStoreEntity = {
          country: addressModel.country,
          department: addressModel.department,
          city: addressModel.city,
          lat: latLng.lat,
          lng: latLng.lng,
        }


        // Saving locationStoreEntity in Firestore
        this.firebase.fireStore.collection(this.stores)
          .doc(`${store.phone}/location/${index}`)
          .set(locationStoreEntity, {
            merge: true
          });
      }


      // Saving each location in Firestore
      createStoreDto.latLng.forEach((latLng, index) => {

        saveLocationStoreEntity(latLng, index);
      })


      // Create storeEntity
      const storeEntity: CreateStoreEntity = {
        address: createStoreDto.address,
        category: createStoreDto.category,
        nameStore: createStoreDto.nameStore,
        phoneCall: createStoreDto.phoneCall,
        phoneWhatsApp: createStoreDto.phoneWhatsApp,
        telegram: createStoreDto.telegram,
        visibility: createStoreDto.visibility,
        phoneIdStore: store.phone,
      }


      // Verify store exist
      const ifExistStore = (await this.firebase.fireStore
        .collection(this.stores)
        .doc(store.phone)
        .get()).exists


      // If store don't exist, add Date create
      const now = new Date();
      if (!ifExistStore) {
        storeEntity.createData = now.toString()
      }


      // Saving storeEntity in Firestore
      this.firebase.fireStore.collection(this.stores)
        .doc(store.phone)
        .set(storeEntity, { merge: true })


      return {
        success: true,
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

      let querySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>

      console.log(findAllStoreDto);

      const addressModel = await this.geoCodingService.latLngToAddress({
        lat: Number(findAllStoreDto.lat),
        lng: Number(findAllStoreDto.lng),
      })

      console.log(addressModel);

      if (!findAllStoreDto.category) {

        querySnapshot = await this.firebase.fireStore
          .collection(this.stores)
          .where('city', '==', addressModel.city)
          .where('country', '==', addressModel.country)
          .where('department', '==', addressModel.department)
          .get()

      } else {

        querySnapshot = await this.firebase.fireStore
          .collection(this.stores)
          .where('city', '==', addressModel.city)
          .where('country', '==', addressModel.country)
          .where('department', '==', addressModel.department)
          .where('categoryStore', '==', findAllStoreDto.category)
          .get()
      }


      const res = querySnapshot.docs.map((e) => {
        return e.data()
      });

      return {
        success: true,
        res
      }

    } catch (error) {

      return {
        success: false,
        error: error.message
      }
    }


  }

  async findOne(id: string) {

    try {

      const documentSnapshot = await this.firebase.fireStore.collection(this.stores).doc(id).get()


      if (!documentSnapshot.exists) {

        throw new Error("Store don't exist");
      }

      const res = documentSnapshot.data()

      return {
        success: true,
        res
      }

    } catch (error) {

      return {
        success: false,
        error: error.message
      }
    }

    return `This action returns a #${id} store`;
  }


  remove(id: string) {
    return `This action removes a #${id} store`;
  }
}
