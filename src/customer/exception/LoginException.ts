import { HttpException, HttpStatus } from '@nestjs/common';

export class LoginException extends HttpException {
  constructor() {
    super(
      'Please make sure your account exists and is activated.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
