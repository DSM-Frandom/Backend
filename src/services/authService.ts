import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import { UserLogin } from "../interfaces";
import { User } from "../models";

export default class AuthService {
    constructor(
        private jwtSecret: string
    ) {}

    public async signIn(userLogin: UserLogin, userRepository: Repository<User>): Promise<{accessToken: string; refreshToken: string}> {
        const userRecord = await userRepository.findOne({ email: userLogin.email });

        if(!userRecord || AuthService.isInvalidPassword(userRecord.password, userLogin.password)) {
            throw new createHttpError.Unauthorized("Invalid id or password");
        }

        const accessToken = this.generateToken({
            id: userRecord.id,
            type: "access"
        });
        const refreshToken = this.generateToken({
            id: userRecord.id,
            type: "refresh"
        });

        return { accessToken, refreshToken };
    }

    public tokenRefresh({ refreshToken }: { refreshToken: string; }): { accessToken: string} {
        const splitToken = refreshToken.split(" ");
        if(splitToken[0] !== "Bearer") {
            throw new createHttpError.Unauthorized();
        }
        const refreshPayload: any = jwt.verify(splitToken[1], this.jwtSecret);
        if(refreshPayload.type !== "refresh") {
            throw new createHttpError.Forbidden();
        }
        const accessToken = this.generateToken({
            id: refreshPayload.id,
            type: "access"
        });
        return { accessToken };
    }

    private generateToken({ id, type }: { id: number, type: string }) {
        return jwt.sign({ id, type }, this.jwtSecret, {
            expiresIn: type === "access" ? "2h" : type === "refresh" ? "14d" : 0,
        });
    }

    private static isInvalidPassword(dbPassword: string, inputPassword: string): boolean {
        return !bcrypt.compareSync(inputPassword, dbPassword);
    }
}