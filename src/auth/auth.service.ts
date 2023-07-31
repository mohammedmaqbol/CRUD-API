import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { User } from '../users/schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dtos/register.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
  async registerUser(registerUserDto: RegisterUserDto): Promise<any> {
    const newUser: User = {
      username: registerUserDto.username,
      email: registerUserDto.email,
      avatar: registerUserDto.avatar,
      password: registerUserDto.password,
      role: 'admin',
    };
    const user = await this.usersService.addUser(newUser);
    return { success: true, user };
  }

    async generateToken(user: any): Promise<any> {
      const payload = { sub: user.id, role: user.role };
      return {
        token: this.jwtService.sign(payload, {
          secret: 'MbpCK6Myuh'
        }),
      };
  }
}
