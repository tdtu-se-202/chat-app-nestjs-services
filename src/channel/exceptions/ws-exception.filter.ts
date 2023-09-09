import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
import { WsException, BaseWsExceptionFilter } from '@nestjs/websockets';
import { AuthenticatedSocket } from '../dto/authenticated-socket';

@Catch()
export class WebsocketsExceptionFilter extends BaseWsExceptionFilter implements WsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToWs()
    const socket = context.getClient<AuthenticatedSocket>();
    const exceptionMessage = exception || 'Internal server error';
    if (exception instanceof WsException) {
        console.log(exception.getError())
        // socket.emit('response', {
        // status: 'error',
        // message: exceptionMessage,
        // });
    }

    super.catch(exceptionMessage, host);
  }
}
