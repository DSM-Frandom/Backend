import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import config from "../config";
import AuthService from "../services/authService";
import { TokenExpiredError } from "jsonwebtoken";
import { CreateUserDto, UserLoginDto } from "../models/user.dto";

export default class AuthController {
    private authService = new AuthService(config.jwtSecret);

    public register = async (req: Request, res: Response, next: NextFunction) => {
        const userRegister: CreateUserDto = req.body;
        await this.authService.register(userRegister);
        return res.status(201).json({
            message: "Signup successfully"
        });
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        const userLogin: UserLoginDto = req.body;
        const tokens = await this.authService.login(userLogin);
        return res.status(200).json(tokens);
    }

    public verify = async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        const accessNumber = await this.authService.verify(email);
        return res.status(200).json({
            accessNumber
        });
    }

    public refresh = async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.get("x-refresh-token");
        try {
            const accessToken = this.authService.tokenRefresh({ refreshToken });
            res.status(200).json(accessToken);
        } catch (err) {
            if (err === TokenExpiredError) {
                return next(new createHttpError.Gone("Expired token"));
            } else if(err === createHttpError[403]) {
                return next(new createHttpError.Forbidden());
            }
            next(err);
        }
    }
}