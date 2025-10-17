import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // Get the request object from the current HTTP context
    const request: CustomRequest = ctx.switchToHttp().getRequest();

    if (data) {
      return request.user![data];
    }

    const { password, ...user } = request.user;
    return user;
  },
);
