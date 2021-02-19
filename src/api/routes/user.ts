import { Router } from "express";
import UserController from "../../controllers/user";
import { reportSchema } from "../middlewares/schemaValidate";
import tokenVerification from "../middlewares/tokenVerification";
import tryCatchHandler from "../middlewares/tryCatchHandler";
import validation, { Property } from "../middlewares/validation";
const route = Router();

export default (app: Router) => {
    const userController = new UserController();

    app.use("/user", route);

    route.get(
        "/profile",
        tokenVerification,
        tryCatchHandler(userController.getProfile)
    )

    route.post(
        "/report",
        tokenVerification,
        validation({ schema: reportSchema, property: Property.BODY }),
        tryCatchHandler(userController.createReport)
    );
}