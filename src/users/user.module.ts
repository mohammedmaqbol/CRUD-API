import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { User, UserSchema } from './schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { multerConfig } from '../common/multer/multer.config';
import { MulterModule } from '@nestjs/platform-express';
import { APP_GUARD } from '@nestjs/core/constants';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register(multerConfig),
  ],
  controllers: [UserController],
  providers: [
              UsersService,
              JwtService,
             ],
  exports: [UsersService]
})
export class UserModule { }
