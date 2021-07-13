import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { WhatsAppService } from 'src/providers/whatsapp/whatsapp.service';
import { FirebaseService } from '../providers/firebase/firebase.service';

// class Path {
//   static Users: string = 'users' 
// }

@Injectable()
export class AuthService {

  users: string = 'users'

  constructor(
    // @InjectRepository(User)
    // private readonly repository: Repository<User>,
    private jwtService: JwtService,
    private firebase: FirebaseService,
    private readonly whatsApp: WhatsAppService,
  ) { }

  async verifyPhoneCode(data: CreateUserDto) {

    try {

      const now = new Date()

      const userDoc = await this.firebase.fireStore.collection(this.users).doc(data.phone).get()

      const user = userDoc.data()

      if (!user) {
        throw new Error('Phone invalid')
      }

      // TODO: Single Use Code
      // Explanation: 
      //  A user can verify multiple phones before the code expires

      const expire = new Date(user.codeExpire)

      if (user.smsCode !== data.smsCode) {
        throw new Error('Sms code invalid')

      }

      if (expire < now) {
        throw new Error('Sms code expired')
      }

      const payload = { phone: user.phone };

      return {
        success: true,
        token: this.jwtService.sign(payload),
      }

    } catch (error: any) {

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

      const now = new Date()

      const expire = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        (now.getMinutes() + 5),
        now.getSeconds(),

      ).toISOString();


      const data: CreateUserDto = {
        phone,
        smsCode: code,
        codeExpire: expire
      }

      const user = await this.firebase.fireStore.collection(this.users).doc(data.phone).get()

      let prettyCode: string[] = data.smsCode.split('');

      prettyCode.splice(3, 0, ' ')

      // Update Current User
      if (user) {

        data.smsCode = code;
        data.codeExpire = expire

        await this.firebase.fireStore.collection(this.users)
          .doc(data.phone)
          .set(data, {
            merge: true,
            
          })

        await this.whatsApp.sendSimpleText({
          msjText: `*${prettyCode.join('')}* es tu código de verificación de *All App*`,
          phone: data.phone
        })

        return {
          success: true,

        }

        // Create New User
      } else {

        // await this.repository.save(data)
        await this.firebase.fireStore.collection(this.users)
          .doc(data.phone)
          .set(data)

        await this.whatsApp.sendSimpleText({
          msjText: `*${prettyCode.join('')}* es tu código de verificación de *All App*`,
          phone: data.phone
        })

        return {
          success: true,
        }

      }

    } catch (error) {

      return {
        success: false,
        error: error.message
      }
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
