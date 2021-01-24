import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from ".";

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
}