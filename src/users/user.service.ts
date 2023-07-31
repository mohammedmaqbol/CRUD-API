import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { CreateUserDto } from '../users/dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Injectable()
export class UsersService {
  [x: string]: any;
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async addUser(createUserDto: CreateUserDto): Promise<any> {
    const newUser: User = {
      username: createUserDto.username,
      email: createUserDto.email,
      avatar: createUserDto.avatar,
      password: createUserDto.password,
      role: 'user',
    };
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  async updateUser(id :string): Promise<User> {
    const userToUpdate: User = await this.userService.getUserById(id);
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }
    return this.userService.updateUser(id, UpdateUserDto);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
