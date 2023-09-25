import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../config';
import { UsersModule } from '../users/users.module';
import { PhotosController } from './controllers/photos.controller';
import { Photo } from './entities/photo.entity';
import { PhotosService } from './services/photos.service';

@Module({
  imports: [
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dest: config.STORAGE_TMP,
      }),
    }),
    TypeOrmModule.forFeature([Photo]),
    UsersModule,
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
