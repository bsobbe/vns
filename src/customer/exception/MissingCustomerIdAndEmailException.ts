import { HttpException, HttpStatus } from '@nestjs/common';

export class MissingCustomerIdAndEmailException extends HttpException {
  constructor() {
    super('Please provide either a valid ID or Email.', HttpStatus.BAD_REQUEST);
  }
}
