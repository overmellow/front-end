import mongoose, { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  contracts: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IParty {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  contracts?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
