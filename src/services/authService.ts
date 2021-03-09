import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { Like, User } from '../models';
import { CreateUserDto, UserLoginDto } from '../models/user.dto';
import smtpTransport from '../config/email';
import client from '../config/redis';
import util from 'util';

export default class AuthService {
  constructor(private jwtSecret: string) {}

  public async register(dto: CreateUserDto): Promise<void> {
    const exUserEmail = await User.findUserByEmail(dto.email);
    const exUserUsername = await User.findUserByUsername(dto.username);
    if (exUserEmail) {
      throw new createHttpError.Conflict(
        `${dto.email} 이미 가입된 이메일입니다.`
      );
    }

    if (exUserUsername) {
      throw new createHttpError.Conflict(
        `${dto.username} 이미 가입된 이름입니다.`
      );
    }

    const user = await User.createUser(dto);
    await Like.createLike(user);
  }

  public async login(
    dto: UserLoginDto
  ): Promise<{ accessToken: string; refreshToken: string; url: string }> {
    const userRecord = await User.findUserByEmail(dto.email);

    if (
      !userRecord ||
      AuthService.isInvalidPassword(userRecord.password, dto.password)
    ) {
      throw new createHttpError.Unauthorized(
        '아이디 또는 비밀번호를 확인하여 주세요!'
      );
    }

    const accessToken = this.generateToken({
      id: userRecord.id,
      nickname: userRecord.username,
      type: 'access',
    });
    const refreshToken = this.generateToken({
      id: userRecord.id,
      nickname: userRecord.username,
      type: 'refresh',
    });

    return { accessToken, refreshToken, url: userRecord.profile_img };
  }

  public async verify(email: string): Promise<void> {
    const verifyNumber = this.generateRandom(111111, 999999);
    client.set(email, verifyNumber.toString(), (err) => {
      if (err) {
        console.log(err);
        throw new createHttpError.InternalServerError();
      }
      client.expire(email, 500);
    });

    const mailOptions = {
      from: `"Frandom" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '[Frandom] 인증번호 발송',
      text: `인증번호: ${verifyNumber}`,
    };

    await smtpTransport.sendMail(mailOptions).catch((err) => {
      console.log(err);
      throw new createHttpError.BadRequest();
    });
    smtpTransport.close();
  }

  public async checkVerify(email: string, verify: string): Promise<boolean> {
    const getValuePromise = util.promisify(client.get).bind(client);
    const redisGetValueByEmail = await getValuePromise(email);

    if (redisGetValueByEmail !== verify) {
      throw new createHttpError.BadRequest('Does not match');
    }
    return true;
  }

  public tokenRefresh({
    refreshToken,
  }: {
    refreshToken: string;
  }): { accessToken: string } {
    const splitToken = refreshToken.split(' ');
    if (splitToken[0] !== 'Bearer') {
      throw new createHttpError.Unauthorized();
    }
    const refreshPayload: any = jwt.verify(splitToken[1], this.jwtSecret);
    if (refreshPayload.type !== 'refresh') {
      throw new createHttpError.Forbidden();
    }
    const accessToken = this.generateToken({
      id: refreshPayload.id,
      nickname: refreshPayload.nickname,
      type: 'access',
    });
    return { accessToken };
  }

  private generateToken({
    id,
    nickname,
    type,
  }: {
    id: number;
    nickname: string;
    type: string;
  }) {
    return jwt.sign({ id, nickname, type }, this.jwtSecret, {
      expiresIn: type === 'access' ? '2h' : type === 'refresh' ? '14d' : 0,
    });
  }

  private generateRandom = (min: number, max: number) => {
    let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return ranNum;
  };

  private static isInvalidPassword(
    dbPassword: string,
    inputPassword: string
  ): boolean {
    return !bcrypt.compareSync(inputPassword, dbPassword);
  }
}
