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

    public async createLike(username: string, id: number): Promise<void> {
        const target = await User.findUserByUsername(username);
        const user = await User.getRepository().findOne(id);
        if(!target || !user) {
            throw new createHttpError.NotFound('User not found');
        }
        if(target.id === user.id) {
            throw new createHttpError.BadRequest('You can\'t like yourself')
        }

        const like = await Like.getRepository().findOne({ user: target });
        const likeHasUserRecord = await LikeHasUser.findLikeHasUserByUserAndLike(user, like);
        if(likeHasUserRecord) {
            throw new createHttpError.BadRequest('Already liked user');
        }
        await LikeHasUser.createLikeHasUser(user, like);
    }
}