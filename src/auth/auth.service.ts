import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from "cache-manager";
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { WhatsAppService } from 'src/providers/whatsapp/whatsapp.service';
import { FirebaseService } from '../providers/firebase/firebase.service';

@Injectable()
export class AuthService {

  users: string = 'users'

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly whatsApp: WhatsAppService,
    private readonly firebase: FirebaseService,
    // private readonly httpService: HttpService
  ) { }

  async verifyPhoneCode(userDto: CreateUserDto) {

    try {

      // Check exist user 
      const phoneCache = await this.cacheManager.get<string>(`__code__${userDto.phone}`)
      if (!phoneCache) {
        throw new Error('Phone invalid')
      }

      // Compare cache code with user code
      let user: CreateUserDto = JSON.parse(phoneCache)
      if (user.smsCode !== userDto.smsCode) {
        throw new Error('Sms code invalid')

      }

      // Delete cache code
      // Used to generate a one-time code
      this.cacheManager.del(`__code__${userDto.phone}`);

      // Verify user existence to create account creation date
      const ifExistUser = (await this.firebase.fireStore
        .collection(this.users)
        .doc(userDto.phone)
        .get()).exists;
      if (!ifExistUser) {
        userDto.createDateUser = new Date().toString()
      }



      // Create user in Firestore 
      delete userDto.smsCode;
      this.firebase.fireStore
        .collection(this.users)
        .doc(userDto.phone)
        .set(userDto)

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

  async createPhoneCode(phone: string) {

    try {

      const random = Math.random() * 1e10

      const code: string = random.toString().substring(0, 6)


      const userDto: CreateUserDto = {
        phone,
        smsCode: code,
      }

      let prettyCode: string[] = userDto.smsCode.split('');

      prettyCode.splice(3, 0, ' ')

      userDto.smsCode = code;

      const stringUserData = JSON.stringify(userDto)

      await this.cacheManager.set(
        `__code__${userDto.phone}`,
        stringUserData, {
        ttl: 360
      });

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
