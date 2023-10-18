const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
  try {
    const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(403).json({
        status: 'failed',
        message: 'Unauthorized',
      });
    }
  } catch (e) {
    return res.status(403).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
  next();
};

const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

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

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: `No user with username ${username}`,
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '15m',
        },
      );
      res.status(200).json({
        status: 'success',
        accessToken,
      });
    } else {
      res.status(400).json({
        status: 'failed',
        message: 'Something went wrong',
      });
    }
  } catch (e) {
    res.status(400).json({
      status: 'failed',
      message: e.message,
    });
  }
};

module.exports = {
  loginUser,
  authenticateToken,
  createUser,
};
