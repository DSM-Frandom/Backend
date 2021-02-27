import { NextFunction } from "express";
import { Server } from "socket.io";
import jwt from "jsonwebtoken"
import config from "./config";
import { Payload } from "./interfaces";
import createHttpError from "http-errors";
import SocketService from "./services/socketService";
import SocketTypes from "./interfaces/SocketTypes";

export default class SocketApp {
    private socketService = new SocketService();

    public async start(io: Server) {
        io.use( async (socket: SocketTypes | any, next: NextFunction | any) => {
            try {
                const token: string = socket.handshake.query.token;
                const splitToken = token.split(" ");
                if(splitToken[0] !== "Bearer") {
                    throw new createHttpError.Unauthorized();
                }
                jwt.verify(splitToken[1], config.jwtSecret, (err: Error, payload: Payload) => {
                    socket.userId = payload.id;
                    socket.nickname = payload.nickname;
                    next();
                });
            } catch (err) {
                next(err);
            }
        })

        io.on("connect", (socket: SocketTypes) => {
            console.log("connect: " + socket.userId);

            socket.on("search", async () => {
                const roomId = await this.socketService.search(socket.userId);

                await socket.join(roomId);
                socket.currentRoom = roomId;
                console.log(`${socket.nickname} is joined room ${roomId}`);

                socket.in(roomId).emit("joinRoom", socket.nickname);
                if(io.sockets.adapter.rooms.get(roomId).size === 2) {
                    io.in(roomId).emit("matched");
                }
            });

            socket.on("leaveRoom", () => {
                console.log(`${socket.nickname} is leave room ${socket.currentRoom}`);
                socket.leave(socket.currentRoom);
            });

            socket.on("fileUpload", (url: string) => {
                console.log(`${socket.nickname} uploaded file`);
                socket.in(socket.currentRoom).emit("fileUpload", url);
            })

            socket.on("sendMessage", async (msg: string) => {
                const newChat = await this.socketService.sendMessage(msg, socket.userId, socket.currentRoom);
                socket.broadcast.in(socket.currentRoom).emit("receiveMessage", msg, socket.nickname);
                console.log(`${socket.nickname}: ${newChat}`);
            })

            socket.on("disconnect", () => {
                socket.in(socket.currentRoom).emit("leaveRoom", socket.nickname);
                socket.leave(socket.currentRoom);
                this.socketService.disconnect(socket.userId);
            });
        })
    }
}