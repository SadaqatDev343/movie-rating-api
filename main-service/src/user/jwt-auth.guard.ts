// src/user/jwt-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, skip authentication
    if (isPublic) {
      return true;
    }

    // Otherwise, proceed with the default JWT authentication
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('Authenticated User:', user); // Debugging log

    if (err || !user) {
      console.error('Auth Error:', err || info); // Log error details
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
