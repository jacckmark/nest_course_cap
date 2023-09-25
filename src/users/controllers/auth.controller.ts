import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { Payload } from '../decorators/payload.decorator';
import { Roles } from '../decorators/roles.decorator';
import {
  AuthLoginDto,
  AuthLoginResponse,
  AuthRegisterDto,
  AuthRegisterResponse,
} from '../dto';
import { UserErrorResponse } from '../dto/user.dto';
import { RoleNames, User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@ApiTags('auth')
@Controller('auth')
// @Roles(RoleNames.ADMIN)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get('me')
  @ApiResponse({
    status: 422,
    type: UserErrorResponse,
    description: 'user not authorized',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  // me(@Auth() user: User) {
  // @Roles(RoleNames.ROOT)
  me(@Payload('user') user: User) {
    return { user };
  }

  @Post('login')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (error) => {
        throw new UnprocessableEntityException(error);
      },
    }),
  )
  async login(@Body() data: AuthLoginDto): Promise<AuthLoginResponse> {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) throw new UnauthorizedException('Credentials are invalid');

    const token = await this.authService.encodeUserToken(user);

    return { token, user };
  }

  @Post('register')
  @ApiResponse({
    status: 422,
    type: UserErrorResponse,
    description: 'user exist already',
  })
  async register(
    @Body(ValidationPipe) data: AuthRegisterDto,
  ): Promise<AuthRegisterResponse> {
    let [user] = await this.userService.findBy({ email: data.email });
    if (user) throw new UnprocessableEntityException('Email already taken');
    const hashedPass = await this.authService.encodePassword(data.password);
    user = await this.userService.create({ ...data, password: hashedPass });
    return { user };
  }
}
