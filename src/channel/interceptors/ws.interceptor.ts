import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AuthenticatedSocket } from '../dto/authenticated-socket';

@Injectable()
export class WebsocketsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): any {
        const data = context.switchToWs().getData();
        const client = context.switchToWs().getClient<AuthenticatedSocket>();
        console.log("interceptor catched" + data)
        return next.handle().pipe(
            map((data) => {
                const response = {
                    status: "ok",
                    event: data.event,
                    success: true,
                    data: data.data,
                }
                client.emit("response", response)
                return (true)
            }),
        );
    }
}