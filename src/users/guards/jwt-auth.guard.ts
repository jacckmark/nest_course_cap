import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User, RoleNames } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const cls = context.getClass();

    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException();

    request.payload = await this.authService.decodeUserToken(token);

    if (!request.payload) throw new UnauthorizedException();

    const requiredRoles: RoleNames[] = this.reflector.getAllAndOverride(
      ROLES_KEY,
      [handler, cls],
    );

    if (!requiredRoles) return true;

    const userRoles: RoleNames[] = request.payload.user.roles.map(
      (el) => el.name,
    );

    // if you return true/false guard will throw the 403 forbidden error by default
    return !!requiredRoles.some((role) => userRoles.includes(role));
  }

  extractToken(request: Request): string {
    const token = request.headers.authorization;
    return token ? token.replace('Bearer ', '') : '';
  }
}
