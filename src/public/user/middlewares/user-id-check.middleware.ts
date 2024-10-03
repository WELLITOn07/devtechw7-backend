import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: NextFunction) => void) {
    if (isNaN(Number(req.params.id)) || Number(req.params.id) < 1) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Invalid user id',
        error: 'Bad Request',
      });
    }
    next();
  }
}
