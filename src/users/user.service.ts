import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schema/user.schema';

@Injectable()
export class UsersService {
  [x: string]: any;
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async addUser(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async updateUser(id: string, user): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, user).exec();
  }

  async deleteUser(id: string): Promise<User> {
    return this.userModel.findByIdAndRemove(id).exec();
  }
}
