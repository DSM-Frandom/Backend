import express , { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";

const app: express.Application = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Hello;");
})

app.listen(3000, () => {
    console.log("server running on port 3000");
})