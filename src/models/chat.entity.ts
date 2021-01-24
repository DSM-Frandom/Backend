import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room, User } from ".";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100})
    message: string;

    @OneToOne(type => User, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @OneToOne(type => Room, { onDelete: "CASCADE" })
    @JoinColumn()
    room: Room;

    @CreateDateColumn()
    created_at: Date;
}