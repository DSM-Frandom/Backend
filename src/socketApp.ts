import { Server, Socket } from "socket.io";

export default class SocketApp {
    public async start(io: Server) {
        io.on("connect", (socket: Socket) => {
            console.log("connect");
    
            socket.on("disconnect", () => {
                console.log("disconnect");
            })
        })
    }
}