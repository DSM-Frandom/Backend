import { Router } from "express";
import { auth, file, user } from "./routes";

export default () => {
    const app = Router();

    auth(app);
    user(app);
    file(app);

    return app;
}