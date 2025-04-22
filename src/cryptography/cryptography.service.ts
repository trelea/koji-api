import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { scryptSync } from 'node:crypto';

@Injectable()
export class CryptographyService {
  private readonly salt: string;
  private readonly key_length: number;

  constructor(private readonly configService: ConfigService) {
    this.salt = this.configService.getOrThrow<string>('CRYPTO_SALT');
    this.key_length = parseInt(
      this.configService.getOrThrow<string>('CRYPTO_KEY_LEN'),
    );
  }

  async encrypt(plain: string): Promise<string> {
    return scryptSync(plain, this.salt, this.key_length).toString('hex');
  }

  async verify(hashed: string, plain: string): Promise<boolean> {
    if (hashed === (await this.encrypt(plain))) return true;
    return false;
  }
}
