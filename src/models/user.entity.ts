import { Column, CreateDateColumn, Entity, getConnection, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Chat, Report } from ".";
import { CreateUserDto } from "./user.dto";
import bcrypt from "bcrypt";

@Entity()
export class User {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: "varchar", length: 100, unique: true })
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

    static async createUser(dto: CreateUserDto): Promise<void> {
        const userRepository = this.getRepository();
        const hash = await bcrypt.hash(dto.password, 12);
        const newUser = userRepository.create({
            email: dto.email,
            password: hash,
            username: dto.username,
        });
        await userRepository.save(newUser);
    }

    static async findUserByEmail(email: string): Promise<User> {
        return await this.getRepository().findOne({ email });
    }
}