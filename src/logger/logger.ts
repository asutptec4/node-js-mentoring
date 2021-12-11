import winston from 'winston';
import 'winston-mongodb';

import config from '../config';

export type LoggerInterface = winston.Logger;

export const Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'isoDateTime' }),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({
      filename: './log/error.log',
      level: 'error',
    }),
  ],
});

if (process.env.NODE_ENV === 'production') {
  Logger.add(
    new winston.transports.MongoDB({
      level: 'info',
      db: `mongodb://${config.mongoDbUser}:${config.mongoDbPassword}@${config.mongoDbHost}:27017/logs?authSource=admin`,
      collection: 'server_logs',
      tryReconnect: true,
    })
  );
} else {
  Logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    })
  );
}
