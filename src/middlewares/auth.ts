import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../services';

export const createAuthMiddleware =
  (service: AuthService) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (token) {
      if (service.verify(token.replace('Bearer', '').trim())) {
        next();
      } else {
        res.status(403).json({ error: 'Invalid token.' });
      }
    } else {
      res
        .status(401)
        .json({ error: 'Please authorize before sending requests.' });
    }
  };
