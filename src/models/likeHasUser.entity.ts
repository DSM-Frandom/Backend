import { Column, Entity, getConnection, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Like, User } from ".";

@Entity({ name: "like_has_user" })
export class LikeHasUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.likeHasUsers)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Like, like => like.likeHasUsers)
    @JoinColumn({ name: "like_id" })
    like: Like;

    @Column({ type: "tinyint", default: 0 })
    status: number;

    static getRepository() {
        return getConnection().getRepository(LikeHasUser);
    }

    // same user exception
    static async createLikeHasUser(user: User, like: Like): Promise<void> {
        const likeHasUserRepository = this.getRepository();
        const newLike = likeHasUserRepository.create({ user, like });
        await likeHasUserRepository.save(newLike);
    }

    static async findLikeHasUserByUserAndLike(user: User, like: Like): Promise<LikeHasUser> {
        return await this.getRepository().findOne({ user, like });
    }
}