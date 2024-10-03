import { Types } from 'mongoose';

export interface ContractI {
  _id?: Types.ObjectId;
  title: string;
  owner: Types.ObjectId | string;
  parties: Types.ObjectId[] | string[];
  clauses: {
    _id?: Types.ObjectId;
    content: string;
  }[];
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
