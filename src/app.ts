import express, { Express, Request, Response, NextFunction } from "express";
const app: Express = express();

app.get('/', (req: Request, res: Response): Response => {
    return res.send("Hello;");
})

app.listen(3000, () => {
    console.log("server running on port 3000");
})