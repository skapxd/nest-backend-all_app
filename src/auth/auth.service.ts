import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from "cache-manager";
import { WhatsAppService } from 'src/providers/whatsapp/whatsapp.service';
import { FirebaseService } from '../providers/firebase/firebase.service';
import { GeoCodingService } from '../api-v1/geo_coding/geo_coding.service';
import { VerifyPhoneCodeDto } from './dto/verify_phone_code.dto';
import { UserEntity } from './entities/user.entity';
import { CreatePhoneCodeDto } from './dto/create_phone_code.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateEntity } from './entities/create.entity';


@Injectable()
export class AuthService {

  users: string = 'users'

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly whatsApp: WhatsAppService,
    private readonly geoCodingService: GeoCodingService,

  ) { }

  async verifyPhoneCode(data: VerifyPhoneCodeDto) {

    try {

      // Check exist user 
      const phoneCache = await this.cacheManager.get<string>(`__code__${data.phone}`)
      if (!phoneCache) {
        throw new Error('Phone invalid')
      }


      // Compare cache code with user code
      let user: VerifyPhoneCodeDto = JSON.parse(phoneCache)
      if (user.smsCode !== data.smsCode) {
        throw new Error('Sms code invalid')
      }


      // Verify user existence
      const ifExistUser = await this.userRepository.findOne({
        where: {
          phone: data.phone
        }
      })


      // Delete cache code
      // Used to generate a one-time code
      delete data.smsCode;
      this.cacheManager.del(`__code__${data.phone}`);


      // Declaring userEntity, get AddressModel and set in UserCreateEntity
      const saveEntity = async () => {


        const userEntity = new UserEntity()
        userEntity.phone = data.phone;


        userEntity.create = new UserCreateEntity()
        userEntity.create.latLng = {
          lat: data.latLng.lat,
          lng: data.latLng.lng,
        }


        // Add AddressModel and DateCreate to userEntity
        const addressModel = await this.geoCodingService.latLngToAddress({
          lat: data.latLng.lat,
          lng: data.latLng.lng,
        })
        userEntity.create.city            = addressModel.city
        userEntity.create.department      = addressModel.department
        userEntity.create.country         = addressModel.country
        userEntity.create.createDateUser  = new Date().toString()


        // Save userEntity
        this.userRepository.save(userEntity);
      }


      // If user don't existe, execute saveEntity
      if (!ifExistUser) {
        saveEntity();
      }


      return {
        success: true,
        token: this.jwtService.sign({ phone: user.phone }),
      }

    } catch (error: any) {

      console.log(error.message);

      return {
        success: false,
        error: error.message
      }
    }

  }

  async createPhoneCode(userDto: CreatePhoneCodeDto) {

    try {


      // Generate code to validate
      const random = Math.random() * 1e10
      const code: string = random.toString().substring(0, 6)
      userDto.smsCode = code;

      // Improving code readability
      let prettyCode: string[] = userDto.smsCode.split('');
      prettyCode.splice(3, 0, ' ')
      userDto.smsCode = code;


      // Caching code
      const stringUserData = JSON.stringify(userDto)
      await this.cacheManager.set(
        `__code__${userDto.phone}`,
        stringUserData, {
        ttl: 360
      });


      // Sending code to the client's WhatsApp 
      this.whatsApp.sendSimpleText({
        msjText: `*${prettyCode.join('')}* es tu código de verificación de *All App*`,
        phone: userDto.phone.replace(/[-\+]/g, '')
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
}
