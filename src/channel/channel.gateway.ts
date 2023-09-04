import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { MessageService } from "src/message/message.service";
import { MessageDto } from "./dto/message-dto";
import { UseGuards, UseInterceptors, UseFilters, Injectable, Logger } from "@nestjs/common";
import { WsJwtAuthGuard } from "src/auth/guards/ws-jwt.guard";
import { ClassSerializerInterceptor } from "@nestjs/common/serializer";
import { WebsocketsInterceptor } from "./interceptors/ws.interceptor";
import { WebsocketsExceptionFilter } from "./exceptions/ws-exception.filter";
import { UserService } from "src/user/user.service";
import { AuthService } from "src/auth/auth.service";
import { AuthenticatedSocket } from "./dto/authenticated-socket";
import { SocketAuthMiddleware } from "./middlewares/ws-auth.mw";
import { NotificationDto } from "./dto/notification-dto";

@WebSocketGateway(9000 ,{
  cors: {origin: '*'},
  transports: ['websocket'],
})

@UseGuards(WsJwtAuthGuard)
// /@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(WebsocketsInterceptor)
@UseFilters(WebsocketsExceptionFilter)
@Injectable()
export class ChannelGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  private logger: Logger = new Logger('GatewayServer')
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log(`Socket server is listening at port: 9000`)
    server.use(SocketAuthMiddleware(this.authService) as any); // because types are broken
  }

  handleConnection(@ConnectedSocket() socket: AuthenticatedSocket) {
    try {
      console.log(`connected socket: {id: ${socket.id}, username: ${socket.user.username}}`);
      
      // handle connection logic here
      socket.broadcast.emit('server-send-new-online-user', socket.user)
      this.server.emit('server-send-new-online-user', socket.user)

    } catch (error) {
      console.log(`process connect failed, socket: {id: ${socket.id}, username: ${socket.user.username}}`)
      socket.disconnect()
      throw new WsException(`process connect failed, socket: {id: ${socket.id}, username: ${socket.user.username}}`);
    }
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log(`disconnected socket: {id: ${socket.id}, username: ${socket.user.username}}`);
  }

  @SubscribeMessage("client-send-test-message")
  handleClientSendTestMessage(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: unknown): WsResponse<unknown> {
    this.server.emit('server-send-test-message', {user: client.user, data})
    const event = 'client-send-test-message'  
    return {event, data};
  }

  @SubscribeMessage("chat")
  handleMessage(@MessageBody() message: MessageDto) {
    this.server.emit("chat", message);
    this.messageService.addMessage(message);
    return {event: 'chat', data: 'message'}
  }

  @SubscribeMessage("notification")
  handleNotification(@MessageBody() notification: NotificationDto) {
    this.server.emit("notification", notification);
  }
}
