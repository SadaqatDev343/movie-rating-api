import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
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
