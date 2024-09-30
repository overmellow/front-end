import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
  title: { type: String},
  content: { type: String },
}, { timestamps: true });

const Contract = mongoose.models.Contract || mongoose.model('Contract', contractSchema);

export default Contract;
  