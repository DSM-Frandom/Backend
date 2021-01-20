import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/user";
import { signAccessToken } from "./functions/signToken";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

export default class AuthController {
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
        const savedUser = await userRepository.save(newUser);
        const accessToken = await signAccessToken(savedUser.id);
        return res.status(201).json({ accessToken });
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const userRepository = getRepository(User);
        const promise_exUser: Promise<User | null> = userRepository.findOne({ where: { email: email } });

        const exUser: User | null = await promise_exUser;
        if(!exUser) {
            throw new createHttpError.Unauthorized(`${email} is not found`);
        }
        const pwdCmp: boolean = bcrypt.compareSync(password, exUser.password);
        if(!pwdCmp) {
            throw new createHttpError.Unauthorized("Password dose not match");
        }

        const accessToken = await signAccessToken(exUser.id);
        res.status(201).json({ accessToken });
    }
}