import { Sequelize } from "sequelize-typescript";
import { Channel } from "src/channel/channel.entity";
import { FriendRequest } from "src/friend/entities/friend-requests.entity";
import { Friend } from "src/friend/entities/friends.entity";
import { Message } from "src/message/message.entity";
import { User } from "src/user/user.entity";

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: "postgres",
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        logging: false
      });
      sequelize.addModels([User, Message, Channel, Friend, FriendRequest]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
