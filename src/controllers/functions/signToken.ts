import config from "../../config";
import jwt from "jsonwebtoken";

interface Token {
    (user_id: number): Promise<string>
}

const signAccessToken: Token = async (user_id: number) => {
    const secretKey: string = config.jwtSecret;
    const payload = {
        user_id: user_id,
        type: "access"
    }
    const options = {
        expiresIn: "2h",
        issuer: "frandom"
    }

    return jwt.sign(payload, secretKey, options);
}

export { 
    signAccessToken
}