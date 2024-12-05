import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
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

export const RateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // IP당 최대 요청 수
  handler: (req, res) => {
      res.status(429).json({
          success: false,
          error: {
              message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
          }
      });
  },
  standardHeaders: true, // X-RateLimit-* 헤더 포함
  legacyHeaders: false
})