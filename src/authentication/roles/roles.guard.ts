import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RolesGuard.name);
  }

  canActivate(context: ExecutionContext): boolean {
    try {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }
      const ctx = GqlExecutionContext.create(context);
      const user = ctx.getContext().req.user;
      return roles.some((role) => user?.role?.includes(role));
    } catch (e) {
      this.logger.error('canActivate() Failed to authorize roles.', e);
      return false;
    }
  }
}
