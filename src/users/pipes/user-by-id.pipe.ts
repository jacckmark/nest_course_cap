import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private userService: UsersService) {}

  async transform(id: any, metadata: ArgumentMetadata): Promise<User> {
    id = parseInt(id, 10);

    if (!id) throw new BadRequestException('ID param validation failed');

    const user = await this.userService.findOne(id);

    if (!user)
      throw new NotFoundException(`User with given id (${id}) does not exist`);

    return user;
  }
}
