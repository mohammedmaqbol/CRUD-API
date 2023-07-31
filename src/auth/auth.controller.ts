import { Body, Controller, Post, HttpStatus, Res, UsePipes, UseInterceptors,UploadedFile} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.dto';
import { RegisterUserDto } from './dtos/register.dto';
import {JoiValidationPipe} from '../common/pipes/joi-validation.pipe';
import {RegisterUserDtoSchema, LoginUserDtoSchema} from './dtos/validation.dto.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles, Role } from 'src/auth/guard/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new JoiValidationPipe(LoginUserDtoSchema))
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
 
  ): Promise<Response> { 
    const user = await this.authService.loginUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }
    const token = await this.authService.generateToken(user);   
    return res.status(HttpStatus.OK).json({message: 'Hello ' + user.username, token});

  }

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body(new JoiValidationPipe(RegisterUserDtoSchema)) registerUserDto: RegisterUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    registerUserDto.avatar = file.path
    const registrationResult = await this.authService.registerUser({...registerUserDto});
    if (!registrationResult.success) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: registrationResult.message });
    }
    const token = await this.authService.generateToken(registrationResult.user);
    return res.status(HttpStatus.OK).json(token);
  }
}
