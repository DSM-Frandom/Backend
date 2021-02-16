import { Request, Response, Router } from "express";
import AuthController from "../../controllers/auth";
import { registerSchema, loginSchema, refreshSchema } from "../middlewares/schemaValidate";
import validation, { Property } from "../middlewares/validation";
import tryCatchHandler from "../middlewares/tryCatchHandler";
const route = Router();

export default (app: Router) => {
    const authController = new AuthController();

    app.use("/auth", route);

    route.post(
        "/register",
        validation({ schema: registerSchema, property: Property.BODY }),
        tryCatchHandler(authController.register)
    );

    route.post(
        "/login",
        validation({ schema: loginSchema, property: Property.BODY }),
        tryCatchHandler(authController.login)
    );

    route.get(
        "/refresh",
        validation({ schema: refreshSchema, property: Property.HEADERS}),
        tryCatchHandler(authController.refresh)
    );
}