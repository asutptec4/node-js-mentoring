import { NextFunction, Request, Response } from 'express';

import { Logger } from '../logger/logger';

export const wrapErrorHandler =
  (
    controllerMethod: (
      req: Request,
      res: Response,
      ...args: unknown[]
    ) => Promise<void>,
    controllerMethodName: string
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
      Logger.error({
        methodName: controllerMethodName,
        request: {
          params: JSON.stringify(req.params),
          query: JSON.stringify(req.query),
          body: JSON.stringify(req.body),
        },
        error: e,
      });
      next(e);
    }
  };

export function AsyncDefaultErrorHandler() {
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
      return wrapErrorHandler(original.bind(this), propertyKey).apply(this, [
        req,
        res,
        next,
        ...args,
      ]);
    };
    return descriptor;
  };
}
