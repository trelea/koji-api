import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotConfiguredException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.PRECONDITION_REQUIRED,
        message: 'Complete your profile setup to continue',
        requiredActions: [
          'SET_PROFILE_THUMBNAIL',
          'SET_HASHNAME',
          'SET_DATA_BIRTH',
        ],
      },
      HttpStatus.PRECONDITION_REQUIRED,
    );
  }
}
