import { Request, Response, NextFunction } from 'express';
import type { TemporalClient } from '../lib/temporal-client';

export default function attachTemporalClient(temporalClient: TemporalClient) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.context = {
      temporalClient,
    };
    next();
  };
}
