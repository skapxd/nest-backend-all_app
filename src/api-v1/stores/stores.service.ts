import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { FirebaseService } from '../../providers/firebase/firebase.service';

@Injectable()
export class StoresService {

  private stores: string = 'stores'

  constructor(
    private firebase: FirebaseService
  ) { }

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

  async findAll() {

    try {

      const querySnapshot = await this.firebase.fireStore.collection(this.stores).get()

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
