import { getRepository, Repository } from "typeorm";
import { Chat, Room, User } from "../models";

export default class SocketService {
    public async search(userId: number) {
        const roomRepository = getRepository(Room);
        const userRepository = getRepository(User);
        const roomRecord = await roomRepository.findOne({ where: { state: "W" } });
        const exRoom = await roomRepository.findOne({ where: { user: userId } });
        const user = await userRepository.findOne(userId);
        if (!roomRecord && !exRoom) {
            const newRoom = await roomRepository.create({
                user: user
            });

            await roomRepository.save(newRoom);
            return String(newRoom.id);
        } else if (!roomRecord && exRoom) {
            exRoom.state = "W";
            roomRepository.save(exRoom);
            return String(exRoom.id);
        }

        roomRecord.state = "F";
        roomRepository.save(roomRecord);
        return String(roomRecord.id);
    }

    public async sendMessage(msg: string, user_id: number, room_id: string) {
        const roomRepository = getRepository(Room);
        const userRepository = getRepository(User);
        const chatRepository = getRepository(Chat);
        const user = await userRepository.findOne(user_id);
        const room = await roomRepository.findOne(room_id);
        const newChat = await chatRepository.create({
            message: msg,
            user: user,
            room: room
        })
        await chatRepository.save(newChat);

        return newChat.message;
    }

    public async disconnect(userId: number) {
        const roomRepository = getRepository(Room);
        const roomRecord = await roomRepository.findOne({ where: { user: userId } });
        if(!roomRecord) {
            return;
        }
        roomRecord.state = "E";
        roomRepository.save(roomRecord);

        console.log("disconnect: " + userId);
    }
}