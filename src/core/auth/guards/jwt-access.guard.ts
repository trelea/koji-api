import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAccessStrategyGuard extends AuthGuard('jwt-access') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
