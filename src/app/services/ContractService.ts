import Contract from '../schemas/Contract';

// Create a new contract
const createContract = async (contractData) => {
  const contract = new Contract(contractData);
  return await contract.save();
};

// Get all contracts
const getAllContracts = async () => {
  return await Contract.find();
};

// Get contract by ID
const getContractById = async (id) => {
  return await Contract.findById(id);
};

// Update contract
const updateContract = async (id, updateData) => {
  return await Contract.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete contract
const deleteContract = async (id) => {
  return await Contract.findByIdAndDelete(id);
};

module.exports = {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
};
