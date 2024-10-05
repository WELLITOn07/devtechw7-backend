import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamStringId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    return String(ctx.switchToHttp().getRequest().params.id);
  },
);
