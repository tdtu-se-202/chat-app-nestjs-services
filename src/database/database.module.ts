
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { postgresConfig, postgresConfigToken } from "./ormconfig";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(postgresConfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const defaultConfig =
          configService.get(postgresConfigToken);
        return {
          type: 'postgres',
          host: defaultConfig.host,
          port: defaultConfig.port,
          username: defaultConfig.username,
          password: defaultConfig.password,
          database: defaultConfig.database,
          autoLoadEntities: true,
          migrations: defaultConfig.migrations,
          migrationsRun: defaultConfig.autoMigration,
          migrationsTableName: defaultConfig.migrationsTableName,
          logging: defaultConfig.logging,
          ssl:
            process.env.DB_SSLMODE === 'require'
              ? {
                rejectUnauthorized: false,
                ssl: true,
              }
              : null,
          extra: {
            max: defaultConfig.connectionPoolSize,
          },
        };
      },
    }),
  ],
})
class DatabaseModule {}

export default DatabaseModule;
