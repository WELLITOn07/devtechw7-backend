import { NextFunction, Request, Response } from 'express';
import { NestMiddleware } from '@nestjs/common';

export class CourseIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.params.id == 'null' || req.params.id == 'undefined') {
      return res.status(400).json({
        statusCode: 400,
        message: 'Invalid course id',
        error: 'Bad Request',
      });
    }
    next();
  }
}
