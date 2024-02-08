import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountActivationException extends HttpException {
  constructor() {
    super(
      'Account activation failed. Please try again or contact support if the problem persists.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
