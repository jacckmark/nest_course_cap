import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PhotosService } from '../photos/services/photos.service';

@Controller('worker')
export class WorkerController {
  constructor(private photoService: PhotosService) {}

  @MessagePattern('sum')
  addNumbers(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
  }

  @MessagePattern('thumbs')
  thumbs(filename: string): void {
    this.photoService.createThumbs(filename);
  }
}
