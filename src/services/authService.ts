import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { CreateUserDto, UserLoginDto } from "../models/user.dto";

export default class AuthService {
    constructor(
        private jwtSecret: string
    ) {}

    public async register(dto: CreateUserDto): Promise<void> {
        const exUser = await User.findUserByEmail(dto.email);
        if(exUser) {
            throw new createHttpError.Conflict(`${dto.email} is already been registered`);
        }
        await User.createUser(dto);
    }

    public async login(dto: UserLoginDto): Promise<{accessToken: string; refreshToken: string}> {
        const userRecord = await User.findUserByEmail(dto.email);

        if(!userRecord || AuthService.isInvalidPassword(userRecord.password, dto.password)) {
            throw new createHttpError.Unauthorized("Invalid id or password");
        }

        const accessToken = this.generateToken({
            id: userRecord.id,
            nickname: userRecord.username,
            type: "access"
        });
        const refreshToken = this.generateToken({
            id: userRecord.id,
            nickname: userRecord.username,
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
            nickname: refreshPayload.nickname,
            type: "access"
        });
        return { accessToken };
    }

    private generateToken({ id, nickname, type }: { id: number, nickname:string, type: string }) {
        return jwt.sign({ id, nickname,type }, this.jwtSecret, {
            expiresIn: type === "access" ? "2h" : type === "refresh" ? "14d" : 0,
        });
    }

    private static isInvalidPassword(dbPassword: string, inputPassword: string): boolean {
        return !bcrypt.compareSync(inputPassword, dbPassword);
    }
}