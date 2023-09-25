import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as sharp from 'sharp';

export interface Options {
  type?: string;
}

@Injectable()
export class PhotosValidationPipe implements PipeTransform {
  constructor(private options: Options = {}) {}

  async transform(
    file: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Promise<Express.Multer.File> {
    const [type] = file.mimetype.split('/');
    if (type !== (this.options.type || 'image'))
      throw new UnprocessableEntityException('Provided file is not an image');

    const fileStats = sharp(file.path).stats();

    if (!fileStats)
      throw new UnprocessableEntityException('Provided file is not an image');

    return file;
  }
}
