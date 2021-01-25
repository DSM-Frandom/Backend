import { Repository } from "typeorm";
import { Room, User } from "../models";

export default class SocketService {
    public async search(roomRepository: Repository<Room>, userRepository: Repository<User>, userId: number) {
        const roomRecord = await roomRepository.findOne({ where: { state: "W" } });
        const exRoom = await roomRepository.findOne({ where: { user: userId } });
        const User = await userRepository.findOne(userId);
        if (!roomRecord && !exRoom) {
            const newRoom = await roomRepository.create({
                user: User
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

    public async disconnect(roomRepository: Repository<Room>, userId: number) {
        const roomRecord = await roomRepository.findOne({ where: { user: userId } });
        if(!roomRecord) return;
        roomRecord.state = "E";
        roomRepository.save(roomRecord);

        console.log("disconnect: " + userId);
    }
}