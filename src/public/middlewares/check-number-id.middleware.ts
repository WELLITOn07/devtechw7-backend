import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckNumberIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);

    if (isNaN(id) || id < 1) {
      throw new BadRequestException('Id is not a valid number value');
    }

    next();
  }
}
