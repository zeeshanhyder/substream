import type { TemporalClient } from '../../lib/temporal-client';

export {};

declare global {
  namespace Express {
    interface Request {
      context: {
        temporalClient?: TemporalClient;
      };
    }
  }
}
