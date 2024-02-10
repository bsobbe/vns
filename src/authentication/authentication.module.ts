import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles/roles.guard';
import { EnvLoader } from 'src/env.loader';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: EnvLoader.get('JWT_SECRET'),
    }),
  ],
  providers: [AuthenticationService, JwtStrategy, RolesGuard],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
