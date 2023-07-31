export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  avatarFilename?: string; 
}
