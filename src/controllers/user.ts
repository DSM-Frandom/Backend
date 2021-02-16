import { Request, Response, NextFunction } from "express";
import { CreateReportDto } from "../models/report.dto";
import UserService from "../services/userService";

export default class UserController {
    private userService = new UserService();

    public createReport = async (req: Request, res: Response, next: NextFunction) => {
        const createReport: CreateReportDto = req.body;
        await this.userService.createReport(createReport, res.locals.payload.id);
        return res.status(201).json({
            message: "Report send successfully",
        });
    }
}