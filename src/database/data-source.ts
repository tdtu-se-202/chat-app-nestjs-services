import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from 'dotenv';
import { ConfigService } from "@nestjs/config";


config({
    path:  './src/.env.development',
});
const configService = new ConfigService();
export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE_NAME'),
    entities: ['dist/**/*/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
