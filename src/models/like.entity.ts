import { Column, Entity, getConnection, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from ".";
import { LikeHasUser } from "./likeHasUser.entity";

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    count: number;

    @OneToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => LikeHasUser, likeHasUser => likeHasUser.like, { onDelete: "CASCADE" })
    likeHasUsers: LikeHasUser[];

    static getRepository() {
        return getConnection().getRepository(Like);
    }

    static async createLike(user: User): Promise<void> {
        const likeRepository = this.getRepository();
        const newLike = likeRepository.create({ user });
        await likeRepository.save(newLike);
    }
}