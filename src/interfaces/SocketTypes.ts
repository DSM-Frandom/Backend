import { Socket } from "socket.io";

export default interface SocketTypes extends Socket {
    userId?: number;
    nickname?: string;
    currentRoom?: string;
}