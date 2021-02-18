import config from './src/config';
import { User, Room, Chat, Report, File } from "./src/models";

export = {
    type: "mysql",
    host: config.mysql.dbHost,
    port: Number(config.mysql.dbPort),
    username: config.mysql.dbUser,
    password: config.mysql.dbPass,
    database: config.mysql.dbName,
    synchronize: true,
    logging: true,
    entities: [User, Room, Chat, Report, File]
};