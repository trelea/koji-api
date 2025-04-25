import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CryptographyService } from 'src/cryptography';

@Injectable()
export class OTPStrategy extends PassportStrategy(Strategy, 'otp') {
  constructor(
    private readonly configService: ConfigService,
    private readonly cryptographyService: CryptographyService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request<unknown, unknown, unknown, Partial<{ _tkn: string }>>) =>
          req.query._tkn as string,
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_OTP_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request<unknown, unknown, unknown, Partial<{ _tkn: string }>>,
  ) {
    if (!req.cookies['_tkn_hsh']) return false;
    return await this.cryptographyService.verify(
      req.cookies['_tkn_hsh'] as string,
      req.query._tkn as string,
    );
  }
}
