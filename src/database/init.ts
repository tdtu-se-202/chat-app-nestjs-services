import { config } from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';

// Load configuration
const loadEnv = () => {
  let envPath: string;

  switch (process.env.NODE_ENV) {

    case 'development':
      console.log("development env is used...")
      envPath = './src/.env.development';
      break;
    default:
      console.log("global env is used...")
      envPath = './src/.env';
      break;
  }

  //console.log(`${process.cwd()}/src/.env.${process.env.NODE_ENV}`)
  const dotenvConfigOutput = config({
    path: envPath,
  });

  console.log(dotenvConfigOutput)
  if (dotenvConfigOutput.error){
    console.error(dotenvConfigOutput.error)
  }
};

loadEnv();

// Constants
const defaultDB = 'postgres';
const databaseNeedToCreate = process.env.DB_DATABASE;
/**
 * MAIN
 */

let connection: Sequelize = null;

const createDatabaseIfNotExist = async (databaseName: string) => {
  console.log(process.execPath)
  console.log(process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_PASSWORD)
  try {
    // Establish the connection
    connection = await new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: defaultDB,
    });

    // Get all existed databases
    const checkExistedDBQuery: string = `SELECT 0 FROM pg_database WHERE datname = '${databaseName}';`
    const databasesQueryResult: any[] = await connection.query(checkExistedDBQuery, {
      raw: true,
      type: QueryTypes.SELECT
    });
    if (databasesQueryResult.length > 0) {
      console.info(`Database ${databaseName} is existed!`);
    } else {
      console.info(`Database ${databaseName} is not exist. Creating database ...`);
      await connection.query(`CREATE DATABASE ${databaseName};`);
      console.log(`Database ${databaseName} is created!`);
    }
  } catch (e) {
    console.error('Error when init database:', e.message);
  }
};

createDatabaseIfNotExist(databaseNeedToCreate).then(() => connection.close());
