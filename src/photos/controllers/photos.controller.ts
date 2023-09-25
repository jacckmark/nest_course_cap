import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { PhotoUploadDto } from '../dto/photos.dto';
import { PhotosService } from '../services/photos.service';
import { PhotosValidationPipe } from '../pipes/photos-validation.pipe';
import { Response } from 'express';
import { ConfigService } from '../../config';
import { join } from 'path';
import { User } from '../../users/entities/user.entity';
import { Auth } from '../../users/decorators/auth.decorator';
import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';
import { ClientProxy, Transport, Client } from '@nestjs/microservices';

@Controller('photos')
@ApiTags('photos')
export class PhotosController {
  @Client({ transport: Transport.TCP, options: { port: 3001 } })
  client: ClientProxy;

  constructor(
    private photosService: PhotosService,
    private configService: ConfigService,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async upload(
    @UploadedFile(new PhotosValidationPipe({ type: 'image' }))
    file: Express.Multer.File,
    @Body() data: PhotoUploadDto,
    @Auth() user: User,
  ) {
    const photo = await this.photosService
      .create(file, data, user)
      .catch(() => null);
    // const thumbs = await this.photosService.createThumbs(photo?.filename);
    const thumbs = await this.client.send('thumbs', photo.filename).toPromise();
    return { file, data, photo, thumbs };
  }

  @Get('download/:filename')
  @ApiParam({ name: 'filename', type: String })
  async download(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    const file = join(this.configService.STORAGE_PHOTOS, filename);

    res.download(file, filename, (err) => {
      if (err)
        throw new UnprocessableEntityException('Your file download failed');
    });
  }

  @Get('sum')
  sum(@Query('numbers') numbers: string) {
    const payload: number[] = (numbers || '')
      .split(',')
      .map((el) => parseInt(el, 10));

    return this.client.send<number>('sum', payload);
  }
}
