import { NextFunction, Request, Response } from 'express';

import { Logger } from '../logger/logger';

export const wrapErrorHandler =
  (
    controllerMethod: (
      req: Request,
      res: Response,
      ...args: unknown[]
    ) => Promise<void>
  ) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction,
    ...args: unknown[]
  ) => {
    try {
      await controllerMethod(req, res, args);
    } catch (e: unknown) {
      Logger.error({ request: req, response: res, error: e });
      next(e);
    }
  };

export function AsyncErrorHandler() {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction,
      ...args: unknown[]
    ) {
      return wrapErrorHandler(original.bind(this)).apply(this, [
        req,
        res,
        next,
        ...args,
      ]);
    };
    return descriptor;
  };
}
