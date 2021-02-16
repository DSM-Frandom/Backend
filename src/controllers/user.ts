import { Request, Response, NextFunction } from "express";
import UserService from "../services/userService";

export default class UserController {
    private userService = new UserService();

    public createReport = async (req: Request, res: Response, next: NextFunction) => {
        const { title, description } = req.body;
        await this.userService.createReport({ title, description }, res.locals.payload.id);
        return res.status(201).json({
            message: "Report send successfully",
        });
    }
}