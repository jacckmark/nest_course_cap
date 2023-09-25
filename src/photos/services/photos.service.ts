import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { readdir, rename } from 'fs/promises';
import { extname, join, resolve } from 'path';
import { ConfigService, joinUrl } from '../../config';
import * as sharp from 'sharp';
import { Photo } from '../entities/photo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoUploadDto } from '../dto/photos.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class PhotosService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) {}

  async create(file: Express.Multer.File, data: PhotoUploadDto, user: User) {
    const ext = extname(file.originalname).toLowerCase();
    const filename = createHash('md5').update(file.path).digest('hex') + ext;
    const destFile = join(this.configService.STORAGE_PHOTOS, filename);

    await rename(file.path, destFile);

    const photo = new Photo();
    photo.filename = filename;
    photo.description = data.description;
    photo.user = user;

    await this.photoRepository.save(photo);

    return photo;
  }

  async createThumbs(fileName: string) {
    const srcFile = resolve(this.configService.STORAGE_PHOTOS, fileName);
    const destFile = resolve(this.configService.STORAGE_THUMBS, fileName);

    await sharp(srcFile)
      .rotate()
      .resize(200, 200, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 100 })
      .toFile(destFile);

    return { small: destFile };
  }

  async getPhotos() {
    const files: string[] = await readdir(this.configService.STORAGE_PHOTOS);

    return files.map((photo) => ({
      thumbUrl: joinUrl(this.configService.PHOTOS_BASE_PATH, photo),
      downloadUrl: joinUrl(this.configService.PHOTOS_DOWNLOAD_PATH, photo),
    }));
  }
}
