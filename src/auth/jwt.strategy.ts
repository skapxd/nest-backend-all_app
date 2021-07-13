
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {



  constructor(
    private env: ConfigService
  ) {

    // let key: string = process.env.KEY_TOKEN;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secretOrKey: a,
      // secretOrKey: '%IWASAmVLucI&yOD0zrF#iiwd*',
      secretOrKey: env.keyToken,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}