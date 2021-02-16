export class UserLoginDto {
    email: string;
    password: string;
}

export class CreateUserDto extends UserLoginDto {
    username: string;
}
