import { Sequelize } from "sequelize-typescript";
import { Channel } from "src/channel/channel.entity";
import { Message } from "src/message/message.entity";
import { User } from "src/user/user.entity";

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      let config;
      let sequelize;
      if (process.env.NODE_ENV === "production") {
        console.log(
          "harry-log: 🚀  file: database.providers.ts  line: 13  process.env.DB_URL  useFactory ~ : ",
          process.env.DB_URL
        );
        sequelize = new Sequelize(process.env.DB_URL, {
          dialect: "postgres",
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
        });
      } else {
        config = {
          dialect: "postgres",
          host: process.env.DB_HOST,
          port: 5432,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        };
        sequelize = new Sequelize(config);
      }

      console.log(
        "harry-log: 🚀  file: database.providers.ts  line: 39 -  config  useFactory ~ : ",
        sequelize
      );
      sequelize.addModels([User, Message, Channel]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
