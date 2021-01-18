import { Router } from "express";
import { auth } from "./routes";

export default () => {
    const app = Router();

    app.get("/check", (req, res) => {
        res.status(200).end();
    });

    auth(app);

    return app;
}