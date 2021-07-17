import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { FirebaseService } from '../../providers/firebase/firebase.service';
import { Request } from "express";

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
    private firebase: FirebaseService
  ) { 
    this.firebase.fireStore.settings({
      ignoreUndefinedProperties: true,

    })
  }

  async uploadLogo( 
    files: Express.Multer.File, 
    req: Request, 
    // name: any
  ){

    console.log(req['user']);
    try {
      
      // const type = file.mimetype.split('/')[1];
      console.log(files);
  
  
      // console.log(
      //   type
      // );
  
      // console.log(
      //   file.originalname
      // );
  
      // const logo = await this.firebase.storage
      //   .file(file.originalname)
      //   .save(file.buffer, {
      //     public: true,
      //     private: false, 
          
      //     metadata: {
      //       metadata: {
  
      //         firebaseStorageDownloadTokens: 'REPLACE_THIS_WITH_ANY_TEXT_VALUE_EXAMPLE_UUID',
      //       },
      //     },
      //   });
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

  async create(createStoreDto: CreateStoreDto) {

    try {

      this.firebase.fireStore.collection(this.stores)
        .doc(createStoreDto.phoneIdStore)
        .set(createStoreDto);

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
