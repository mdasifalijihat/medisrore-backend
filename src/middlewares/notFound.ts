import { Request, Response, NextFunction } from "express";
import AppError from "./appErrors";

export function notFound(req: Request, res: Response, next: NextFunction) {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
}
