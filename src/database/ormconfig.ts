import { DataSource } from 'typeorm';
import { ConfigService } from "@nestjs/config";
import { config } from 'dotenv';
import { migrations } from "./migrations";


// Load configuration

config({
  path:  './src/.env.development',
});
const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE_NAME'),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: migrations
});
