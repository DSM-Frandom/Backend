import config from "../../../config";
import { Request, Response, NextFunction } from "express";
import verify from "./verify";
import { TokenExpiredError } from "jsonwebtoken";
import createHttpError from "http-errors";

export default (req: Request, res: Response, next: NextFunction) => {
    const token = req.get("Authorization");
    try {
        res.locals.payload = verify({
            token,
            jwtSecret: config.jwtSecret
        });
        next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return next(new createHttpError.Gone("Expired token"));
        } else if(err === createHttpError[403]) {
            return next(err);
        }
        next(new createHttpError.Unauthorized());
    }
}