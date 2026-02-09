import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any = null;

  /**
   * Prisma: Validation Error
   * Wrong field type / missing field
   */
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data provided";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    /**
     * Prisma: Known Request Error
     * Example: unique constraint, record not found
     */
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = `Duplicate value for field: ${err.meta?.target}`;
        break;

      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;

      case "P2003":
        statusCode = 400;
        message = "Foreign key constraint failed";
        break;

      default:
        statusCode = 400;
        message = "Database request error";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    /**
     * Prisma: Initialization Error
     */
    statusCode = 500;
    message = "Database connection failed";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    /**
     * Prisma: Rust panic (very rare)
     */
    statusCode = 500;
    message = "Unexpected database error";
  } else if (err.statusCode && err.message) {
    /**
     * Custom App Error (if you use it)
     */
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
};

export default errorHandler;
