import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room, User } from ".";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100 })
    message: string;

    @ManyToOne(() => User, user => user.chats)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Room, room => room.chats)
    @JoinColumn({ name: "room_id" })
    room: Room;

    @CreateDateColumn()
    created_at: Date;
}