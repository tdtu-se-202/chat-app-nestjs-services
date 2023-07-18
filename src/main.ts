import { NestFactory } from '@nestjs/core';
import { AppModule } from "./app.module";
// import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.enableCors();
  // // setupSwagger(app);
  // const configService = app.get(ConfigService);
  // const port = Number(configService.get("APP_PORT"));
  // await app.listen(port);

  app.enableCors({
    origin: "http://localhost:3001",
    credentials: true,
  }); // app.use(passport.initialize());
  // app.use(passport.session());
  await app.listen(process.env.APP_PORT || 9696, () => {
    const server = app.getHttpServer();
    const { port } = server.address();
    console.log(`Application is listening on port ${port}`);
  });
}
bootstrap();
