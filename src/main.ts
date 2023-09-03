import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Chatty App")
    .setDescription("The Chatty API description")
    .setVersion("1.0")
    .addTag("chatty-app")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.enableCors({
    origin: [
      "http://localhost:3001",
      "https://white-island-00bebbb10.3.azurestaticapps.net",
    ],
    credentials: true,
  });

  await app.listen(process.env.APP_PORT || 9696, () => {
    const server = app.getHttpServer();
    const { port, address } = server.address();
    const protocol = process.env.PROTOCOL || "http";
    console.log(`Server started at ${protocol}://${address}:${port}`);
  });
}
bootstrap();
