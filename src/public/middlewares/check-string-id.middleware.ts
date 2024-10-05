import { NextFunction, Request, Response } from 'express';
import { NestMiddleware } from '@nestjs/common';

export class CheckStringIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.params.id == 'null' || req.params.id == 'undefined') {
      return res.status(400).json({
        statusCode: 400,
        message: 'Id is not valid string value',
        error: 'Bad Request',
      });
    }
    next();
  }
}
