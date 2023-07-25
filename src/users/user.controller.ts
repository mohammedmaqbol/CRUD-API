import { Body, Controller, Delete, Get, Param, Post, NotFoundException, UsePipes, HttpStatus, Res, Put } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { Response } from 'express';
import {ObjectIdPipe} from '../common/pipes/objectId.pipe'
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import {createUserDtoSchema, updateUserDtoSchema} from './dtos/user-validation.dto.schema';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ObjectIdPipe) id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createUserDtoSchema))
  async addUser(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<Response> {
    const newUser: User = {
      username: createUserDto.username,
      email: createUserDto.email,
      age: createUserDto.age,
      password: createUserDto.password
    };

    const user = await this.userService.addUser(newUser);
    return res.status(HttpStatus.CREATED).json({ message: 'User created successfully', user });
  }

  @Put(':id')
  // @UsePipes()
  async updateUser(@Param('id', ObjectIdPipe) id: string, @Body(new JoiValidationPipe(updateUserDtoSchema)) updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate: User = await this.userService.getUserById(id);
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }
    return this.userService.updateUser(id ,updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ObjectIdPipe) id: string) {
    const deletedUser = await this.userService.deleteUser(id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
