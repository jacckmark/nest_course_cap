import 'express';
import { RequestPayload } from './src/users/entities/user.entity';

declare module 'express' {
  export interface Request {
    payload: RequestPayload | undefined;
  }
}
