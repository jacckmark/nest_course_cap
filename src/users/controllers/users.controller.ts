import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  CreateUserResponse,
  FindUsersDto,
  UpdateUserDto,
  UpdateUserResponse,
  UserErrorResponse,
} from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // for complex queries we use dto's definitions
  @Get()
  async findAll(@Query() query: FindUsersDto) {
    return this.usersService.findAll(query.q);
  }

  // when doing simple queries we can write the parameters inline
  @Get('copy')
  @ApiQuery({ name: 'q', required: false })
  async findAll2(@Query('q') searchStr: string) {
    return this.usersService.findAll(searchStr);
  }

  @Get(':id')
  // forces swagger to block non number id's in docs
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 404,
    type: UserErrorResponse,
    description: 'provided id does not exist error',
  })
  @ApiResponse({
    status: 422,
    type: UserErrorResponse,
    description: 'provided id is not a number',
  })
  findOneWithPipe(@Param('id', UserByIdPipe) user: User) {
    return user;
  }

  // old version of findOne without pipe
  async findById(@Param('id', ParseIntPipe) id: number) {
    // handling error cases (otherwise the api would return nothing and status 200 which is misleading)
    if (!id)
      throw new UnprocessableEntityException('Id param should be a number');

    const user = await this.usersService.findOne(id);

    // handling error cases (otherwise the api would return nothing and status 200 which is misleading)
    if (!user) throw new NotFoundException(`User for id "${id}" not found.`);

    return user;
  }

  @Post()
  async create(@Body() data: CreateUserDto): Promise<CreateUserResponse> {
    // test error throw to test the userExceptionFilter handler
    throw new HttpException('Forbidden', HttpStatus.INTERNAL_SERVER_ERROR);
    const user = await this.usersService.create(data);
    return { user };
  }

  @Delete(':id')
  @ApiResponse({
    status: 400,
    type: UserErrorResponse,
    description: 'deleting operation failed',
  })
  async remove(@Param('id') id: string) {
    const isDeleted = await this.usersService.remove(+id);
    if (!isDeleted)
      throw new BadRequestException('Removing this user is not possible');
    return isDeleted;
  }

  @Patch(':id')
  async update(
    @Body() data: UpdateUserDto,
    @Param() id: string,
  ): Promise<UpdateUserResponse> {
    const user = await this.usersService.update(+id, data);
    return { user };
  }
}
