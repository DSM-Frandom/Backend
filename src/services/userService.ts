import createHttpError from "http-errors";
import { Report, User } from "../models";
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
}