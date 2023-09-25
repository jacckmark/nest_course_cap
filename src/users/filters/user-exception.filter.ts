import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '../../config';

@Catch()
export class UserExceptionFilter implements ExceptionFilter {
  private logger = new Logger('User exception filter', { timestamp: true });

  constructor(private configService: ConfigService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest();
    const res: Response = ctx.getResponse();
    const status = exception.status || 500;
    const userId = req.payload?.user?.id || null;
    const data = {
      statusCode: status,
      userId,
      path: req.url,
      // show error stack and error message on debug mode only
      errorStack: this.configService.DEBUG ? exception.stack : null,
      errorMessage: this.configService.DEBUG ? exception.message : null,
    };

    console.log(status);
    if (status >= 500) this.logger.error(data);
    if (status < 500) this.logger.log(data);

    res.status(status).json(data);
  }
}
