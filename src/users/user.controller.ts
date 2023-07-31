import {
  Body, Controller, Delete,
  Get, Param, Post, NotFoundException,
  UsePipes, HttpStatus, Res, Put,
  Request, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './schema/user.schema';
import { CreateUserDto } from '../users/dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { Response } from 'express';
import { ObjectIdPipe } from '../common/pipes/objectId.pipe';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { createUserDtoSchema, updateUserDtoSchema } from './dtos/user-validation.dto.schema'; 
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Role, Roles } from 'src/auth/guard/roles.decorator';


@Controller('users')
export class UserController { 
  constructor(private readonly userService: UsersService) {}
  
  @Get()
  @Roles(Role.Admin)
    async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
  //@Roles(Role.User)
  @Get('myprofile')
  // TODO: Roles
  async myprofile(@Request() req): Promise<any> {
    return req.user;
  }

  @Get(':id')
  async getUserById(@Param('id', ObjectIdPipe) id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
 @UseInterceptors(FileInterceptor('avatar'))
  async addUser(
    @UploadedFile() file: Express.Multer.File,
    @Body(new JoiValidationPipe(createUserDtoSchema)) createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    createUserDto.avatar = file.path;
    const user = await this.userService.addUser({ ...createUserDto });
    return res.status(HttpStatus.CREATED).json({ message: 'User created successfully' });
  }

  @Put(':id')
  async updateUser(
    @Param('id', ObjectIdPipe) id: string,
    @Body(new JoiValidationPipe(updateUserDtoSchema)) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ObjectIdPipe) id: string): Promise<{ message: string }> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.avatar) {
      try {
        fs.unlinkSync(user.avatar);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
