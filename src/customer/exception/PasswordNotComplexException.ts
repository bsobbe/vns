import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordNotComplexException extends HttpException {
  constructor() {
    super(
      'Password needs to be at least 8 characters with a mix of letters, numbers and symbols.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
