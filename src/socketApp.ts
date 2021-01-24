import { NextFunction } from "express";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken"
import config from "./config";
import { Payload } from "./interfaces";
import createHttpError from "http-errors";
import { getRepository } from "typeorm";
import { Room, User } from "./models";
import SocketService from "./services/socketService";

export default class SocketApp {
    private socketService = new SocketService();

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
            const roomRepository = getRepository(Room);
            const userRepository = getRepository(User);

            socket.on("disconnect", () => {
                this.socketService.disconnect(roomRepository, socket.userId)
            });

            socket.on("search", async () => {
                const roomId = await this.socketService.search(roomRepository, userRepository, socket.userId);
                socket.join(roomId);
                console.log(`${socket.userId} is joined room ${roomId}`);
            });
        })
    }
}