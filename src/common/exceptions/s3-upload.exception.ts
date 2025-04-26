import { HttpException, HttpStatus } from '@nestjs/common';

export class S3UploadException extends HttpException {
  constructor(
    readonly message: string = 'Failed to upload file to S3',
    readonly error?: unknown,
  ) {
    super({ message, error }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
