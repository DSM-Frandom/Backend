import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

function tokenDataTypeCheck(token: string) {
    if(!token || typeof token !== "string" ) {
        throw new createHttpError.Unauthorized();
    }
}

function tokenBearerCheck(splitToken: string[]) {
    if(splitToken[0] !== "Bearer") {
        throw new createHttpError.Unauthorized();
    }
}

function tokenAceessCheck(payload: any) {
    if(payload.type !== "access") {
        throw new createHttpError.Forbidden();
    }
}

export default ({ token, jwtSecret }: { token: string, jwtSecret: string}) => {
    tokenDataTypeCheck(token);
    const splitToken = token.split(" ");
    tokenBearerCheck(splitToken);
    const payload: any = jwt.verify(splitToken[1], jwtSecret);
    tokenAceessCheck(payload);
    return payload;
}