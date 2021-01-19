import "reflect-metadata";

import express , { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import createError, { HttpError } from "http-errors";
import dotenv from "dotenv";
dotenv.config();

// Router
import route from "./api";

// DB connect
import { createConnection } from "typeorm";
import config from "./config";
createConnection().then(() => console.log("DB Connected"));

const app: express.Application = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use("/v1", route());

app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Hello;");
})

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new createError.NotFound());
})

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

app.listen(config.port, () => {
    console.log(`server running on port ${config.port}`);
})