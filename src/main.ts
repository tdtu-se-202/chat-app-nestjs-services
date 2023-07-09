import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // swagger
  const config = new DocumentBuilder()
    .setBasePath('api')
    .setTitle('ChattyApp')
    .setDescription('The ChattyApp API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  // app.use(
  //   session({
  //     secret: 'secretKey',
  //     saveUninitialized: false,
  //     resave: false,
  //     cookie: {
  //       maxAge: 60000,
  //     },
  //   }),
  // );
  app.enableCors({
    origin: 'http://localhost:4927',
    credentials: true,
  });  // app.use(passport.initialize());
  // app.use(passport.session());
  await app.listen(process.env.APP_PORT || 3000, () => {
    const server = app.getHttpServer();
    const { port } = server.address();
    console.log(`Application is listening on port ${port}`);
  });}

bootstrap();
