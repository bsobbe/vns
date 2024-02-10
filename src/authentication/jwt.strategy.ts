import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationService } from './authentication.service';
import { AccessPayload } from 'src/lib/entities/accessPayload.entity';
import { EnvLoader } from 'src/env.loader';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: EnvLoader.get('JWT_SECRET'),
    });
  }

  async validate(payload: AccessPayload): Promise<AccessPayload> {
    // Add further validation here if necessary, and make sure to fail and log accordingly.
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
