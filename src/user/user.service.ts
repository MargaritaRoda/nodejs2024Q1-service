import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

const users: User[] = [
  {
    id: uuidv4(),
    login: 'Marta',
    password: '1111',
    version: 19, // integer number, increments on update
    createdAt: 1709462032895, // timestamp of creation
    updatedAt: 1709462032895, // timestamp of last update
  },
  {
    id: uuidv4(),
    login: 'Irina',
    password: '2222',
    version: 22, // integer number, increments on update
    createdAt: 1709462136161, // timestamp of creation
    updatedAt: 1709462136161, // timestamp of last update
  },
  {
    id: '3995d400-1e4f-4af9-936d-dbc6b05897b8',
    login: 'Olga',
    password: '3333',
    version: 20, // integer number, increments on update
    createdAt: 1709462223497, // timestamp of creation
    updatedAt: 1709462223497, // timestamp of last update
  },
];

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
  create(createUserDto: CreateUserDto) {
    const newUser = {
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1, // integer number, increments on update
      createdAt: Date.now(), // timestamp of creation
      updatedAt: Date.now(), // timestamp of last update
      id: uuidv4(),
    };
    users.push(newUser); //This action adds a new user

    return newUser;
  }

  findAll(): User[] {
    return users; //`This action returns all user`;
  }

  findOne(uuid: string): User {
    const user = users.find((item) => {
      return item.id === uuid;
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const user: User = users.find((item) => {
      return item.id === id;
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.oldPassword !== user.password) {
      throw new HttpException('Invalid old password', HttpStatus.FORBIDDEN);
    }
    user.password = updateUserDto.newPassword;
    user.updatedAt = Date.now();
    user.version = user.version + 1;
    return user;
  }

  async remove(id: string): Promise<boolean> {
    const index = users.findIndex((item) => {
      return item.id === id;
    });
    if (index === -1) {
      return false;
    }
    users.splice(index, 1);
    return true;
  }
}
