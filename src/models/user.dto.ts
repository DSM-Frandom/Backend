import { Gender } from "./user.entity";

export class UserLoginDto {
    email: string;
    password: string;
}

export class CreateUserDto extends UserLoginDto {
    username: string;
    age: number;
    gender: Gender;
}
