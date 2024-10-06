import Contract from '@/app/schemas/Contract';

// Create a new contract
const createContract = async (contractData: any) => {
  const contract = new Contract(contractData);
  return await contract.save();
};

// Get all contracts
const getAllContracts = async () => {
  return await Contract.find();
};

// Get contract by ID
const getContractById = async (id: any  ) => {
  return await Contract.findById(id);
};

// Update contract
const updateContract = async (id: any, updateData: any) => {
  return await Contract.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete contract
const deleteContract = async (id: any) => {
  return await Contract.findByIdAndDelete(id);
};

module.exports = {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
};
