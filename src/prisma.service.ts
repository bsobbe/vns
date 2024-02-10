import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly logger: PinoLogger) {
    super();
    this.logger.setContext(PrismaService.name);
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (e) {
      this.logger.fatal(
        'onModuleInit() Database connection failed. Do not panic!',
        e,
      );
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      try {
        await app.close();
      } catch (e) {
        this.logger.warn(
          'enableShutdownHooks() Database connection failed to close cleanly.',
          e,
        );
      }
    });
  }
}
