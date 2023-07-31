import { ObjectId } from 'mongoose';

export interface User {
    _id: ObjectId;
    name: string;
    username: string;
    email: string;
    avatar: string;
    password: string;
    age: number;
    role: string;
  }
  