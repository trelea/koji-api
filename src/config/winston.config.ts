import 'winston-daily-rotate-file';
import { WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    /**
     * Console
     */
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike('NestApp', {
          prettyPrint: true,
        }),
      ),
    }),

    /**
     * Requests
     */
    new winston.transports.DailyRotateFile({
      level: 'verbose',
      dirname: 'logs',
      filename: 'requests-%DATE%-logs.json',
      maxFiles: '30d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
    }),
  ],
};
