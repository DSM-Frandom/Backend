import createHttpError from "http-errors";
import { Like, LikeHasUser, Report, User } from "../models";
import { CreateReportDto } from "../models/report.dto";

export default class UserService {
    public async getProfile(user_id: number): Promise<Object> {
        const user = await User.getRepository().findOne(user_id);
        if(!user) {
            throw new createHttpError.NotFound('User not found');
        }

        const { password, id, ...result } = user;
        return result;
    }

    public async createReport(dto: CreateReportDto, id: number): Promise<void> {
        const user = await User.getRepository().findOne(id);
        if(!user) {
            throw new createHttpError.NotFound('User not found');
        }

        await Report.createReport(dto, user);
    }

    public async like(username: string, id: number): Promise<void> {
        const user = await User.getRepository().findOne(id);
        const like = await this.findLikeByUser(username, user);
        const likeHasUserRecord = await LikeHasUser.findLikeHasUserByUserAndLike(user, like);
        if(likeHasUserRecord) {
            await LikeHasUser.getRepository().delete(likeHasUserRecord);
        }
        await LikeHasUser.createLikeHasUser(user, like, 1);
        await Like.getRepository().update(like, { count: like.count + 1 });
    }

    public async dislike(username: string, id: number): Promise<void> {
        const user = await User.getRepository().findOne(id);
        const like = await this.findLikeByUser(username, user);
        const likeHasUserRecord = await LikeHasUser.findLikeHasUserByUserAndLike(user, like);
        if(likeHasUserRecord) {
            await LikeHasUser.getRepository().delete(likeHasUserRecord);
        }
        await LikeHasUser.createLikeHasUser(user, like, -1);
        await Like.getRepository().update(like, { count: like.count - 1 });
    }

    private async findLikeByUser(username: string, user: User): Promise<Like> {
        const target = await User.findUserByUsername(username);
        if(!target || !user) {
            throw new createHttpError.NotFound('User not found');
        }
        if(target.id === user.id) {
            throw new createHttpError.BadRequest('You can\'t like yourself');
        }

        const like = await Like.getRepository().findOne({ user: target });
        return like;
    }
}