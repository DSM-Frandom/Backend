import express , { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import createError, { HttpError } from "http-errors";

const app: express.Application = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Hello;");
})

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new createError.NotFound());
})

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

app.listen(3000, () => {
    console.log("server running on port 3000");
})