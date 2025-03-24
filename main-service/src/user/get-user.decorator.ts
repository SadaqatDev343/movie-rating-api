import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('Extracted User from Request:', request.user); // Debugging log
    return request.user || null; // Return `null` if no user is found
  }
);
