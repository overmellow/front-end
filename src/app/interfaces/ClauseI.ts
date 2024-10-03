import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ClauseI {
  _id?: Types.ObjectId | string | typeof uuidv4;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
