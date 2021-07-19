import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { FirebaseService } from '../../providers/firebase/firebase.service';
import { Request } from "express";
import { v4 as uuid4 } from "uuid";
import { ConfigService } from '../../config/config.service';
import { StoreDto } from './dto/store.dto';

interface QueryI {
  city: string
  country: string
  categoryStore: string
  department: string
}

@Injectable()
export class StoresService {

  private stores: string = 'stores'

  constructor(
    private firebase: FirebaseService,
    private config: ConfigService
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

      const user: { phone?: string } = req['user'];

      const ifExistUser = await this.firebase.fireStore
        .collection(this.stores)
        .doc(user.phone)
        .get()

      const now = new Date();

      if (!ifExistUser.exists) {
        createStoreDto.createData = now.toString();
      }

      const userDto: StoreDto = createStoreDto

      userDto.phoneIdStore = user.phone;

      this.firebase.fireStore.collection(this.stores)
        .doc(user.phone)
        .set(userDto, {
          merge: true
        });

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

  async findAll(data: QueryI) {

    try {

      let querySnapshot;

      console.log(data);

      if (!data.categoryStore) {

        querySnapshot = await this.firebase.fireStore
          .collection(this.stores)
          .where('city', '==', data.city)
          .where('country', '==', data.country)
          .where('department', '==', data.department)
          .get()

      } else {

        querySnapshot = await this.firebase.fireStore
          .collection(this.stores)
          .where('city', '==', data.city)
          .where('country', '==', data.country)
          .where('categoryStore', '==', data.categoryStore)
          .where('department', '==', data.department)
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

  async update(id: string, updateStoreDto: UpdateStoreDto) {

    try {

      console.log(updateStoreDto);

      await this.firebase.fireStore.collection(this.stores)
        .doc(id)
        .set(
          updateStoreDto, {
          merge: true
        })

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

  remove(id: string) {
    return `This action removes a #${id} store`;
  }
}
