import { Types } from 'mongoose';

export interface PartyI {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  contracts?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
