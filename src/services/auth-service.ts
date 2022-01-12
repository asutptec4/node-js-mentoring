import jwt from 'jsonwebtoken';

import getConfig from '../config';

const config = getConfig();

export class AuthService {
  getToken(payload: unknown): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpTime,
    });
  }

  verify(token: string): boolean {
    try {
      jwt.verify(token, config.jwtSecret);
      return true;
    } catch (e) {
      return false;
    }
  }
}
