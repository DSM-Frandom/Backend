import { NextFunction } from "express";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken"
import config from "./config";
import { Payload } from "./interfaces";
import createHttpError from "http-errors";

export default class SocketApp {
    public async start(io: Server) {
        io.use( async (socket: Socket | any, next: NextFunction | any) => {
            try {
                const token: string = socket.handshake.query.token;
                const splitToken = token.split(" ");
                if(splitToken[0] !== "Bearer") {
                    throw new createHttpError.Unauthorized();
                }
                jwt.verify(splitToken[1], config.jwtSecret, (err: Error, payload: Payload) => {
                    socket.userId = payload.id;
                    next();
                });
            } catch (err) {
                next(err);
            }
        })

        io.on("connect", (socket: Socket) => {
            console.log("connect: " + socket.userId);

            socket.on("disconnect", () => {
                console.log("disconnect: " + socket.userId);
            })
        })
    }
}