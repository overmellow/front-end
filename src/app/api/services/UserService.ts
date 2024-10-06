import User from '@/app/schemas/User';

// Create a new user
const createUser = async (userData: any) => {
  const user = new User(userData);
  return await user.save();
};

// Get all users
const getAllUsers = async () => {
  return await User.find();
};

// Get user by ID
const getUserById = async (id: any) => {
  return await User.findById(id);
};

// Update user
const updateUser = async (id: any, updateData: any) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete user
const deleteUser = async (id: any) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
