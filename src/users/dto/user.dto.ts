import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  // this is how you would add the example data to swagger (when using 'try it'
  // it would by default use this data)
  @ApiProperty({ example: 'Justyna' })
  name: string;
  @ApiProperty({ example: 'justyna@gmail.com' })
  email: string;
  @ApiProperty({ example: 'secretPassword123' })
  password: string;
}

export class CreateUserResponse {
  user: User;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
}

export class UpdateUserResponse {
  user: User;
}

export class FindUsersDto {
  q?: string;
  page?: number;
  sortBy?: string;
  sortDir?: string;
}

export class UserErrorResponse {
  statusCode: string;
  message: string;
  error: string;
}
