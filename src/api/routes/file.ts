import { Router } from "express";
import { upload } from "../../config/multer";
import FileController from "../../controllers/file";
import tokenVerification from "../middlewares/tokenVerification";
import tryCatchHandler from "../middlewares/tryCatchHandler";
const route = Router();

export default (app: Router) => {
    const fileController = new FileController();

    app.use("/file", route);

    route.post(
        "/",
        tokenVerification,
        upload.single('file'),
        tryCatchHandler(fileController.uploadFile)
    );
}