import type { NextFunction, Request, Response } from 'express';

export function createBountyCreationSignatureMiddleware() {
  return (_req: Request, _res: Response, next: NextFunction) => next();
}

export function createStellarSignatureAuthMiddleware() {
  return (_req: Request, _res: Response, next: NextFunction) => next();
}
