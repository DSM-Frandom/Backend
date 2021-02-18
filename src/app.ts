import "reflect-metadata";

import express , { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import createError, { HttpError } from "http-errors";
import dotenv from "dotenv";
import logger, { errorStream, infoStream } from "./config/winston";
import moment from "moment-timezone";
dotenv.config({ path: path.join(__dirname, "../.env") });

// Router
import route from "./api";

// DB connect
import { createConnection } from "typeorm";
import config from "./config";
import { createOptions } from "./ormconfig";
createConnection(createOptions)
.then(() => console.log("DB Connected"))
.catch((e) => {
    logger.error(`Mysql connection error: ${e}`);
    process.exit(1);
});

// Socket
import { Server } from "socket.io";
import SocketApp from "./socketApp";

morgan.token("date", (req, res) => {
    return moment().tz("Asia/Seoul").format();
});

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(morgan("combined", { 
        stream: errorStream, 
        skip: (req, res) => res.statusCode < 500,
    })
)
app.use(morgan("combined", {
    stream: infoStream,
    skip: (req, res) => res.statusCode >= 500,
}))

app.use("/v1", route());

app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Hello;");
})

app.use((req: Request, res: Response, next: NextFunction) => {
    throw new createError.NotFound();
})

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
    logger.error(err);
})

const server = app.listen(config.port, () => {
    const socketApp = new SocketApp();
    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });
    socketApp.start(io);
    console.log(`server running on port ${config.port}`);
})