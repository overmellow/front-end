import mongoose from "mongoose";
import ContractStatus from "./ContractStatus";

const contractSchema = new mongoose.Schema({
  title: { type: String },
  clauses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clause' }],
  // status: { type: String, enum: ContractStatus, default: ContractStatus.DRAFT },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Contract = mongoose.models.Contract || mongoose.model('Contract', contractSchema);

export default Contract;
