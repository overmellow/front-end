import mongoose, { Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface IClause {
  _id?: Types.ObjectId | string | typeof uuidv4;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const clauseSchema = new mongoose.Schema({
  content: { type: String },
}, { timestamps: true });

const Clause = mongoose.models.Clause || mongoose.model('Clause', clauseSchema);

export default Clause;
