import { Request } from 'express';

declare module 'express' {
  interface Request {
    parsedParams?: Record<string, any>;
    parsedQuery?: Record<string, any>;
  }
} 