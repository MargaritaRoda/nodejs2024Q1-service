import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

export class UserExistsError extends Error {
  message = 'user with login already exists';
}
export class UserDoesNotExistsError extends Error {
  message = 'user does not exist';
}
export class OldPasswordNotExistError extends Error {
  message = 'Old Password is wrong';
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const date = new Date();
    const dateForResponse = date.getTime();
    const user = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1, // integer number, increments on update
        createdAt: date, // timestamp of creation
        updatedAt: date, // timestamp of last update
      },
    });

    return {
      id: user.id,
      login: user.login,
      password: user.password,
      version: user.version, // integer number, increments on update
      createdAt: dateForResponse, // timestamp of creation
      updatedAt: dateForResponse, // timestamp of last update
    };
  }

  async findAll(): Promise<User[]> {
    const dbusers = await this.prisma.user.findMany();
    const users: User[] = [];
    for (const dbuser of dbusers) {
      const user: User = {
        id: dbuser.id,
        login: dbuser.login,
        password: dbuser.password,
        version: dbuser.version,
        createdAt: dbuser.createdAt.getTime(),
        updatedAt: dbuser.updatedAt.getTime(),
      };
      users.push(user);
    }
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      id: user.id,
      login: user.login,
      password: user.password,
      version: user.version,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const date = new Date();
    const dateForResponse = date.getTime();

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.oldPassword !== user.password) {
      throw new HttpException('Invalid old password', HttpStatus.FORBIDDEN);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        id: user.id,
        login: updateUserDto.login,
        password: updateUserDto.newPassword,
        version: user.version + 1, // integer number, increments on update
        updatedAt: date, // timestamp of last update
      },
    });
    return {
      id: updatedUser.id,
      login: updatedUser.login,
      password: updatedUser.password,
      version: updatedUser.version,
      createdAt: user.createdAt.getTime(),
      updatedAt: dateForResponse,
    };
  }
  async remove(id: string) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return deletedUser;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else console.error(error);
    }
  }
}
