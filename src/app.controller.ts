import { Controller, Get, Optional, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ConfigService } from './config';
import { PhotosService } from './photos/services/photos.service';
import { UsersService } from './users/services/users.service';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(
    private configService: ConfigService,
    private readonly appService: AppService,
    private photosService: PhotosService,
    @Optional() private userService: UsersService,
  ) {}

  @Get()
  @Render('photos/index')
  async getHello() {
    const photos = await this.photosService.getPhotos();
    return { photos };
  }

  @Get('chat')
  @Render('chat')
  chat() {}
}
