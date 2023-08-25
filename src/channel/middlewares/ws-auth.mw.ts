import { Socket } from 'socket.io';
import { AuthService } from "src/auth/auth.service";
import { UserService } from 'src/user/user.service';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket } from '../dto/authenticated-socket';

type SocketIOMiddleWare = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (authService: AuthService): SocketIOMiddleWare => {
  return async (socket, next) => {
    try {
      const BearerToken = socket.handshake.auth.authorization || socket.handshake.headers['authorization'] || socket.handshake.query.authorization;
      //configService.isValidAuthHeader(authorization);
      //console.log(BearerToken)
      await authService.verifyJwt(BearerToken.split(' ')[1])
      next();
    } catch (e) {
      console.log('socket middleware error:', e)
      next(new Error(`Unauthorized: ${e.message}`));
    }
  };
};


// export class AuthenticationGatewayMiddleware {
//     constructor(
//       private readonly usersService: UsersService;
//       private readonly authService: AuthService;
//     ) { }
//     resolve() {
//         return (socket, next) => {
//             if (!socket.handshake.query.auth_token) {
//                 throw new WsException('Missing token.');
//             }

//             return jwt.verify(socket.handshake.query.auth_token, 'secret', async (err, payload) => {
//                 if (err) throw new WsException(err);

//                 const user = await this.usersService.findOne({ where: { email: payload.email }});
//                 socket.handshake.user = user;
//                 return next();
//             });
//         }
//     }
// }

export const createTokenMiddleware =
  (authService: AuthService) =>
  async (socket: AuthenticatedSocket, next) => {
    const BearerToken: string =
      socket.handshake.auth.authorization || socket.handshake.headers['authorization'] || socket.handshake.query.authorization;

    //console.debug(`Validating auth token before connection: ${BarrerToken}`);

    try {
      // console.log(BearerToken)
      const payload = await authService.verifyJwt(BearerToken.split(' ')[1]);
      // console.debug(payload)
      socket.user = payload as any;
      next();
    } catch (e) {
      console.log('IO middleware error:', e)
      next(new Error(`Unauthorized: ${e.message}`));
    }
  };