import { NextFunction, Request, Response } from 'express';

import { LoggerInterface } from '../logger/logger';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const createErrorHandlerMiddleware =
  (logger: LoggerInterface) =>
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    res.status(500).json({ error: 'Internal Service Error' });
  };
