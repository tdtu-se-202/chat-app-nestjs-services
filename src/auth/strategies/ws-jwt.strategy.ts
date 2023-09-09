import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { WsJwtPayload } from 'src/utils/ws-jwt-payload';
import { JWT_SECRET } from 'src/utils/constants';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor() {
    const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

    super({
      jwtFromRequest: jwtFromRequest,
      secretOrKey: JWT_SECRET,
      ignoreExpiration: true,
    });
  }

  validate(payload: WsJwtPayload) {
    return payload;
  }
}
