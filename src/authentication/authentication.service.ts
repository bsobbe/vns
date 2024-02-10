import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { EnvLoader } from 'src/env.loader';
import { Customer } from 'src/lib/entities/customer.entity';
import { RefreshPayload } from 'src/lib/entities/refreshPayload.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthenticationService.name);
  }

  async generateAccessToken(customer: Customer): Promise<string> {
    try {
      const payload = {
        id: customer.id,
        email: customer.email,
        role: customer.role,
      };
      return this.jwtService.sign(payload, { expiresIn: '1h' });
    } catch (e) {
      this.logger.error(
        'generateAccessToken() Failed to sign access token.',
        e,
      );
      throw e;
    }
  }

  async generateRefreshToken(customer: Customer): Promise<string> {
    try {
      const payload = { id: customer.id, email: customer.email };
      return this.jwtService.sign(payload, { expiresIn: '7d' });
    } catch (e) {
      this.logger.error(
        'generateRefreshToken() Failed to sign refresh token.',
        e,
      );
      throw e;
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    try {
      const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*\-\_]).{8,}$/;
      return regex.test(password);
    } catch (e) {
      this.logger.error('validatePassword() password validation failed', e);
      throw e;
    }
  }

  async validateRefreshToken(token: string): Promise<RefreshPayload> {
    try {
      return await this.jwtService.verify(token, {
        secret: EnvLoader.get('JWT_SECRET'),
      });
    } catch (e) {
      this.logger.warn('validateRefreshToken() invalid refresh token.', e);
      throw e;
    }
  }
}
