import mongoose, { Types } from "mongoose";
import ContractStatusEnum from "./ContractStatusEnum";

export interface IContract {
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

const contractSchema = new mongoose.Schema({
  title: { type: String },
  clauses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clause' }],
  status: { type: String, enum: ContractStatusEnum, default: ContractStatusEnum.DRAFT },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Contract = mongoose.models.Contract || mongoose.model('Contract', contractSchema);

export default Contract;
