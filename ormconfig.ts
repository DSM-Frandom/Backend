import config from './src/config';

export = {
    type: "mysql",
    host: config.mysql.dbHost,
    port: Number(config.mysql.dbPort),
    username: config.mysql.dbUser,
    password: config.mysql.dbPass,
    database: config.mysql.dbName,
    synchronize: true,
    entities: ["./src/models/*.entity.ts"]
}