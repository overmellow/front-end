import mongoose from "mongoose";

const clauseSchema = new mongoose.Schema({
  content: { type: String },
}, { timestamps: true });

const Clause = mongoose.models.Clause || mongoose.model('Clause', clauseSchema);

export default Clause;
