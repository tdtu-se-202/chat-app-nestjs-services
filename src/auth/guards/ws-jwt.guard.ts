import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedSocket } from 'src/channel/dto/authenticated-socket';


//@Injectable()
// export class WsJwtAuthGuard implements CanActivate {
//   constructor(private authService: AuthService) {}
//   canActivate(context: ExecutionContext): any {
//     if (context.getType() !== 'ws') {
//       return true;
//     }

//     const client = context.switchToWs().getClient<Socket>();
//     const { authorization } = client.handshake.headers;
//     const payload = this.authService.verifyJwt(authorization);

//     // Logger.log({ payload });
//     // context.switchToWs().getData().user = payload;
//     return payload;
//   }
// }
@Injectable()
export class WsJwtAuthGuard extends AuthGuard('ws-jwt') {//implements CanActivate {
  constructor(private authService: AuthService) {
    super()
  }
  canActivate(context: ExecutionContext) {
    console.log('canactive excute new')
    if (context.getType() !== 'ws') {
      return false
    }

    const client = context.switchToWs().getClient<Socket>();
    const { authorization } = client.handshake.headers ?? client.handshake.auth;
    console.log(client.handshake.headers.authorization)
    console.log(client.handshake.query.authenticated)
    if ((typeof authorization === 'undefined') || authorization === null || '') {
      console.log(authorization)
      context.switchToWs().getClient().handshake.headers['authorization'] = client.handshake.query.authorization
    }
    //const payload = this.authService.verifyJwt(authorization);

    // console.log({ payload });
    // context.switchToWs().getData().user = payload;
    // context.switchToWs().getClient().user = payload;
    // return payload;

    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient().handshake;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log("handle request excute")
    // context.switchToWs().getData().user = user;
    context.switchToWs().getClient<AuthenticatedSocket>().user = user;
    console.log(user)
    if (!user) {
      throw err
    }
    return user
  }
}