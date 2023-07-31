import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }


    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      return false; 
    }


    try {
      const decodedToken = this.jwtService.verify(token.replace('Bearer ', ''), {
        secret: 'MbpCK6Myuh'
      });
      const checkuser = await this.userService.getUserById(decodedToken.sub);
      request.user = checkuser;
    } catch (err) {
      return false; 
    }
    
    return requiredRoles.some((role) => request.user.role?.includes(role));
  }
}