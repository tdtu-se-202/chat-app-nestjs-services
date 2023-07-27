import { Socket } from 'socket.io';
import { WsJwtPayload } from 'src/utils/ws-jwt-payload';

export interface AuthenticatedSocket extends Socket {
    user?: WsJwtPayload;
  }