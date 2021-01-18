import { Request, Response, Router } from "express";
const route = Router();

export default (app: Router) => {
    app.use("/auth", route);

    route.get("/check", (req: Request, res: Response) => {
        res.status(200).json();
    });
}