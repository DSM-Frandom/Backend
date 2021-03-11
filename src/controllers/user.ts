import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../interfaces';
import { CreateReportDto } from '../models/report.dto';
import UserService from '../services/userService';

export default class UserController {
  private userService = new UserService();

  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userProfile = await this.userService.getProfile(
      res.locals.payload.id
    );
    return res.status(200).json(userProfile);
  };

  public createReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const createReport: CreateReportDto = req.body;
    await this.userService.createReport(createReport, res.locals.payload.id);
    return res.status(201).json({
      message: 'Report send successfully',
    });
  };

  public getLike = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const like = await this.userService.getLike(
      decodeURI(req.url).replace(/\/like\//, '')
    );
    return res.status(200).json({ like: like.count });
  };

  public deleteLike = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    await this.userService.deleteLike(
      decodeURI(req.url).replace(/\/like\//, ''),
      res.locals.payload.id
    );
    return res.status(200).json({
      message: 'Delete like successfully',
    });
  };

  public like = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    await this.userService.like(
      decodeURI(req.url).replace(/\/like\//, ''),
      res.locals.payload.id
    );
    return res.status(200).json({
      message: 'Like successfully',
    });
  };

  public dislike = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    await this.userService.dislike(
      decodeURI(req.url).replace(/\/dislike\//, ''),
      res.locals.payload.id
    );
    return res.status(200).json({
      message: 'Dislike successfully',
    });
  };
}
