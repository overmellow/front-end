import mongoose from "mongoose";
import ContractStatusEnum from "./ContractStatusEnum";

const contractSchema = new mongoose.Schema({
  title: { type: String },
  clauses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clause' }],
  status: { type: String, enum: ContractStatusEnum, default: ContractStatusEnum.DRAFT },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Contract = mongoose.models.Contract || mongoose.model('Contract', contractSchema);

export default Contract;
