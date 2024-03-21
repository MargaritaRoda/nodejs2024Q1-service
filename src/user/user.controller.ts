import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  HttpCode,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user', description: 'Creates a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been created',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      id: user.id,
    }; //This action adds a new user
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Gets all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful operation' })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single user by id',
    description: 'Get single user by id',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful operation' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: "Update a user's password",
    description: "Updates a user's password by ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been updated',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user: User = await this.userService.update(id, updateUserDto);
    const response: Omit<User, 'password'> = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return response;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete user by ID',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The user has been deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.remove(id);
    // if (user) {
    //   throw new NotFoundException({
    //     statusCode: HttpStatus.NOT_FOUND,
    //     message: ['User is not found by id'],
    //     error: 'Not found',
    //   });
    // }
  }
}
