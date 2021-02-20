import { Request, Response, NextFunction } from "express";
import CustomMulterFile from "../interfaces/file.interface";
import FileService from "../services/fileService";

export default class FileController {
    private fileService = new FileService();

    public uploadFile = async (req: Request, res: Response, next: NextFunction) => {
        const file: CustomMulterFile = req.file;
        await this.fileService.uploadFile(file.location, res.locals.payload.id);
        return res.status(200).json({ message: "File uploaded", url: file.location });
    }

    public uploadProfile = async (req: Request, res: Response, next: NextFunction) => {
        const file: CustomMulterFile = req.file;
        await this.fileService.uploadProfile(file.location, res.locals.payload.id);
        return res.status(200).json({ message: "Profile uploaded", url: file.location });
    }
}