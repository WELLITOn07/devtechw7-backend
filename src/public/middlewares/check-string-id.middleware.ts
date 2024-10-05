import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckStringIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    if (id === 'null' || id === 'undefined') {
      throw new BadRequestException('Id is not a valid string value');
    }

    next();
  }
}
