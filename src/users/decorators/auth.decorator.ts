import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestPayload, User } from '../entities/user.entity';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext): User | undefined => {
    const req: Request = context.switchToHttp().getRequest();

    const payload: RequestPayload = req.payload;

    return payload ? payload.user : undefined;
  },
);
