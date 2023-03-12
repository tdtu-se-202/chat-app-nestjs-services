import { DataSource } from 'typeorm';
import { ConfigService, registerAs } from "@nestjs/config";
import { config } from 'dotenv';
import { migrations } from "./migrations";
import { LoggerOptions } from 'typeorm';


config();

const configService = new ConfigService();


export const postgresConfigToken = 'postgres.config';
export const postgresConfig = registerAs(
  postgresConfigToken,
  () => ({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migrationDir: process.env.MIGRATION_DIR,
    logging:
      process.env.DB_LOGGING === 'true'
        ? true
        : (process.env.DB_LOGGING as LoggerOptions),
    ssl:
      process.env.DB_SSLMODE === 'require'
        ? {
          rejectUnauthorized: false,
        }
        : false,
    autoMigration: Boolean(process.env.AUTO_MIGRATION === 'true'),
    referenceRetrieveConnectionPoolSize: Number(
      process.env.DB_REFERENCE_RETRIEVE_CONNECTION_POOL_SIZE,
    )
      ? Number(process.env.DB_REFERENCE_RETRIEVE_CONNECTION_POOL_SIZE)
      : 2,
    connectionPoolSize: Number(process.env.DB_CONNECTION_POOL_SIZE)
      ? Number(process.env.DB_CONNECTION_POOL_SIZE)
      : 10,
  }),
);


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
