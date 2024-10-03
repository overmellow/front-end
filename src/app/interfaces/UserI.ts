import { Types } from 'mongoose';

export interface UserI {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  contracts: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
