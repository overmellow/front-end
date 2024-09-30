import { User } from '../schemas/User';

// Create a new user
const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

// Get all users
const getAllUsers = async () => {
  return await User.find();
};

// Get user by ID
const getUserById = async (id) => {
  return await User.findById(id);
};

// Update user
const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete user
const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
