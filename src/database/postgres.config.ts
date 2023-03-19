import { registerAs } from "@nestjs/config";
import { LoggerOptions } from "typeorm";
import { migrations } from "./migrations";

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
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: migrations,
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
    autoMigration: Boolean(process.env.DB_AUTO_MIGRATION === 'true'),
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
