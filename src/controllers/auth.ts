import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/user.entity";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import config from "../config";
import { UserLogin } from "../interfaces";
import AuthService from "../services/authService";
import { TokenExpiredError } from "jsonwebtoken";

export default class AuthController {
    private authService = new AuthService(config.jwtSecret);

    public register = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password, username } = req.body;
        const userRepository = getRepository(User);
        const exUser = await userRepository.findOne({
            where: {
                email: email
            }
        });
        // does exist user
        if(exUser) {
            throw new createHttpError.Conflict(`${email} is already been registered`);
        }

        const hash = await bcrypt.hash(password, 12);

        const newUser = await userRepository.create({
            email: email,
            password: hash,
            username: username,
        });

        userRepository.save(newUser).then(() => {
            return res.status(201).json({
                message: "Signup successfully"
            });
        });
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        const userLogin: UserLogin = req.body;
        const userRepository = getRepository(User);
        const tokens = await this.authService.signIn(userLogin, userRepository);
        return res.status(200).json(tokens);
    }

    public refresh = async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.get("x-refresh-token");
        try {
            const accessToken = this.authService.tokenRefresh({
                refreshToken
            });
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