 feat/concurrency-file-locking
import { Request, Response, NextFunction } from 'express';

export function createBountyCreationSignatureMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    next();
  };
}

export function createStellarSignatureAuthMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    next();
  };
}
import type { NextFunction, Request, Response } from 'express';

export function createBountyCreationSignatureMiddleware() {
  return (_req: Request, _res: Response, next: NextFunction) => next();
}

export function createStellarSignatureAuthMiddleware() {
  return (_req: Request, _res: Response, next: NextFunction) => next();
}
 main
