import { NextFunction, Request, Response } from 'express';

import { Logger } from '../logger/logger';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error(err.message);
  res.status(500).json({ error: 'Internal Service Error' });
};
