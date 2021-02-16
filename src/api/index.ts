import { Router } from "express";
import { auth, user } from "./routes";

export default () => {
    const app = Router();

    auth(app);
    user(app);

    return app;
}