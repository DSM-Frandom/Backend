import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/user"
import createHttpError from "http-errors";

export default class AuthController {
    public register = async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;

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
        
        const newUser = await userRepository.create(req.body);
        const savedUser = await userRepository.save(newUser);
        return res.status(201).json(savedUser);
    }
}