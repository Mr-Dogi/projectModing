import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/httpException';
import { logger } from '@utile/logger';
import { BaseErrorResponse } from '@/dtos/error.dto';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    const errorRes: BaseErrorResponse = {
      success : false,
      error : {
        message : message
      }
    }
    res.status(status).json(errorRes);
  } catch (error) {
    next(error);
  }
};