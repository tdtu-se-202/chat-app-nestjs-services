import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { createTokenMiddleware } from '../middlewares/ws-auth.mw';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);
  constructor(
    private app: INestApplicationContext
  ) {
    super(app)
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: `redis://redis:6379` });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    const authService = this.app.get(AuthService);
    server.of('/').use(createTokenMiddleware(authService));
    return server;
  }

}
