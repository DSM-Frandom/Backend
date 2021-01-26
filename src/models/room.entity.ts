import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat, User } from ".";

export type State = "W" | "F" | "E";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: ["W", "F", "E"],
        default: "W"
    })
    state: State;

    @OneToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @OneToMany(() => Chat, chat => chat.room)
    chats: Chat[];
}