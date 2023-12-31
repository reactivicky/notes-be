const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
  const { sort = '-createdAt,_id', limit = 8, select = '' } = req.query;
  const fields = select.split(',').join(' ');
  const sortBy = sort.split(',').join(' ');

  try {
    const users = await User.find().select(fields).sort(sortBy).limit(limit);
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
  getUser,
  deleteUser,
  updateUser,
};
