const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
  const {
    text = '',
    sort = '-createdAt,_id',
    limit = 8,
    select = '',
  } = req.query;
  const fields = select.split(',').join(' ');
  const sortBy = sort.split(',').join(' ');

  try {
    const users = await User.find({ username: text })
      .select(fields)
      .sort(sortBy)
      .limit(limit);
    res.status(200).json({
      status: 'success',
      resultCount: users.length,
      data: {
        users,
      },
    });
  } catch (e) {
    res.status(404).json({
      status: 'failed',
      message: 'No users found',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'failed',
      message: e.message,
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (exports) {
    res.status(404).json({
      status: 'failed',
      message: `No user with id ${id}`,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (exports) {
    res.status(404).json({
      status: 'failed',
      message: `No user with id ${id}`,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (exports) {
    res.status(404).json({
      status: 'failed',
      message: `No user with id ${id}`,
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
};
