import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly logger: PinoLogger) {
    super();
    this.logger.setContext(GqlAuthGuard.name);
  }
  getRequest(context: ExecutionContext) {
    try {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    } catch (e) {
      this.logger.error(
        'getRequest() Failed to create GqlExecutionContext.',
        e,
      );
      return context;
    }
  }
}
