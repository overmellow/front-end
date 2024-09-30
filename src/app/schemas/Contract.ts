import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Contract = mongoose.models.Contract || mongoose.model('Contract', contractSchema);

export default Contract;
