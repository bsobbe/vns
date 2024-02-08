import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordException extends HttpException {
  constructor() {
    super(
      'Please control your password and password confirmation and make sure they are valid.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
