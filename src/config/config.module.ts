import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [ConfigService],
  // remember to export this service otherwise you would not be able to use it in
  // other parts of application
  exports: [ConfigService],
})
export class ConfigModule {}
