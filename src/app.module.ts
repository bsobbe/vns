import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { CustomerModule } from './customer/customer.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { LoggerModule } from 'nestjs-pino';
import { EnvLoader } from './env.loader';

@Module({
  imports: [
    CustomerModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
      context: ({ request, reply }) => ({ request, reply }),
      playground: EnvLoader.get('NODE_ENV') !== 'production' ? true : false,
      introspection: EnvLoader.get('NODE_ENV') !== 'production' ? true : false,
    }),
    LoggerModule.forRoot({
      pinoHttp: [
        {
          level: EnvLoader.get('NODE_ENV') !== 'production' ? 'debug' : 'info',
          transport:
            EnvLoader.get('NODE_ENV') !== 'production'
              ? { target: 'pino-pretty' }
              : undefined,
        },
        // Possible to configure multiple destination streams.
        process.stdout,
      ],
    }),
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
