import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserNotConfiguredException } from '../exceptions';

@Injectable()
export class UserConfiguredGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest() as Request;
    if (!user?.details) throw new UserNotConfiguredException();
    return true;
  }
}
