import { getCustomRepository } from "typeorm";
import { Report, User } from "../models";
import { CreateReportDto } from "../models/report.dto";

export default class UserService {
    public async createReport(dto: CreateReportDto, id: number) {
        const user = await User.getRepository().findOne(id);
        Report.createReport(dto, user);
    }
}