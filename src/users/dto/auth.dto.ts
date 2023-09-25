import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { isEmail, IsEmail, IsString, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';

export class AuthLoginDto {
  @ApiProperty({ example: 'piotr@myflow.pl' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '123' })
  @IsString()
  // we can provide our own messages but we can also leave without message (this library
  // will provide message for us but it might not be ideal for our useCase)
  @MinLength(3, { message: 'Password is to short' })
  password: string;

  @ApiProperty({ example: '2022-03-31' })
  @Transform(({ value }) => new Date(value))
  date?: Date;
}

export class AuthLoginResponse {
  token: string;
  user: User;
}

export class AuthRegisterDto {
  @ApiProperty({ example: 'justyna' })
  @MinLength(3)
  @IsString()
  name: string;
  @ApiProperty({ example: 'justyna@gmail.com' })
  @IsEmail()
  @IsString()
  email: string;
  @ApiProperty({ example: '!@#' })
  @MinLength(3)
  @IsString()
  password: string;
}

export class AuthRegisterResponse {
  user: User;
}
