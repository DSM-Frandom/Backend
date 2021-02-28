import { Column, CreateDateColumn, Entity, getConnection, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat, Report, File, Like } from ".";
import { CreateUserDto } from "./user.dto";
import bcrypt from "bcrypt";
import { LikeHasUser } from "./likeHasUser.entity";

export enum Gender {
    MAN = "M",
    WOMAN = "W"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ length: 16, unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ type: "tinyint", default: 1 })
    age: number;

    @Column({ type: "enum", enum: Gender })
    gender: Gender;

    @Column({ nullable: true })
    profile_img: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Chat, chat => chat.user)
    chats: Chat[];

    @OneToMany(() => Report, report => report.user)
    report: Report[];

    @OneToMany(() => File, file => file.user)
    file: File[];

    @OneToMany(() => LikeHasUser, likeHasUser => likeHasUser.user, { onDelete: "CASCADE" })
    likeHasUsers: LikeHasUser[];

    static getRepository() {
        return getConnection().getRepository(User);
    }

    static async createUser(dto: CreateUserDto): Promise<User> {
        const userRepository = this.getRepository();
        const hash = await bcrypt.hash(dto.password, 12);
        const newUser = userRepository.create({
            email: dto.email,
            password: hash,
            username: dto.username,
            age: dto.age,
            gender: dto.gender
        });
        return await userRepository.save(newUser);
    }

    static async uploadProfile(id: number, location: string): Promise<void> {
        const userRepository = this.getRepository();
        await userRepository.update(id, { profile_img: location });
    }

    static async findUserByEmail(email: string): Promise<User> {
        return await this.getRepository().findOne({ email });
    }

    static async findUserByUsername(username: string): Promise<User> {
        return await this.getRepository().findOne({ username });
    }
}