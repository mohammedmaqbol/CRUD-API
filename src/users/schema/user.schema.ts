import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
export type UserDocument = User & Document;

@Schema()
export class User {
 
  @Prop({ unique: true }) 
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  avatar: string;

  @Prop()
  password: string;

  @Prop()
  role: string;
  
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;

  next();
});
