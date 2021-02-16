import { Column, CreateDateColumn, Entity, getConnection, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Chat, Report } from ".";

@Entity()
export class User {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: "varchar", length: 100 })
    email: string;

    @Column({ type: "varchar", length: 16 })
    username: string;

    @Column({ type: "varchar", length: 255})
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Chat, chat => chat.user)
    chats: Chat[];

    @OneToMany(() => Report, report => report.user)
    report: Report[];

    static getRepository() {
        return getConnection().getRepository(User);
    }
}