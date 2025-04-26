import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly winston: Logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now();

    res.on('finish', () => {
      const finish = performance.now();
      const details = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        ip: (req.headers['x-forwarded-for'] || req.ip) as string,
        responseTime: finish - start,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString(),
      };

      this.winston.verbose(details);
      this.winston.log(details);
    });
    next();
  }
}
