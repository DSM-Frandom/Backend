import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/user"
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
            next(new createHttpError.Conflict(`${email} is already been registered`));
            return;
        }

        const hash = await bcrypt.hash(password, 12);

        const newUser = await userRepository.create({
            email: email,
            password: hash,
            username: username,
        });
        const savedUser = await userRepository.save(newUser);
        return res.status(201).json(savedUser);
    }
}