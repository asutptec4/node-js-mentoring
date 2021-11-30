import { NextFunction, Request, Response } from 'express';

import { LoggerInterface } from '../logger/logger';

export const createLoggerMiddleware =
  (logger: LoggerInterface) =>
  (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const method = req.method;
    const url = req.url;
    const params = JSON.stringify(req.params);
    const body = JSON.stringify(req.body);
    res.on('finish', () => {
      const statusCode = res.statusCode;
      const statusMessage = res.statusMessage;
      logger.info({
        method,
        url,
        statusCode,
        statusMessage,
        params,
        body,
        processTime: `${Date.now() - start}ms`,
      });
    });
    next();
  };
