import { Router } from "express";
import { auth, user } from "./routes";

export default () => {
    const app = Router();

    app.get("/check", (req, res) => {
        res.status(200).end();
    });

    auth(app);
    user(app);

    return app;
}