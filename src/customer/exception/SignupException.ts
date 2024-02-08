import { HttpException, HttpStatus } from '@nestjs/common';

export class SignupException extends HttpException {
  constructor() {
    super(
      'Account signup failed. Please try again or contact support if the problem persists.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
