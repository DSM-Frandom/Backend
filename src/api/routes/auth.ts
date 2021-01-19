import { Request, Response, Router } from "express";
import AuthController from "../../controllers/auth";
import tryCatchHandler from "../middlewares/tryCatchHandler"; 
const route = Router();

export default (app: Router) => {
    const authController = new AuthController();

    app.use("/auth", route);

    route.post("/register", tryCatchHandler(authController.register));
    
    route.get("/check", (req: Request, res: Response) => {
        res.status(200).json();
    });
}