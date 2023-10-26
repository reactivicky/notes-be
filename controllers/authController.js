const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '10m',
  });

const generateNewAccessToken = async (req, res) => {
  const { cookies } = req;
  const refreshToken = cookies.jwt;
  if (!refreshToken) {
    return res.status(401).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(403).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
  try {
    const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(id);
    res.status(200).json({
      status: 'success',
      accessToken,
    });
  } catch (e) {
    return res.status(403).json({
      status: 'failed',
      message: 'Unauthorized',
    });
  }
};

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
    req.userId = id;
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
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      },
    );
    const user = await User.findByIdAndUpdate(
      newUser._id,
      {
        refreshToken,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      status: 'success',
      data: {
        user,
        accessToken,
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
      const accessToken = generateAccessToken(user._id);
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: '1d',
        },
      );
      await User.findByIdAndUpdate(user._id, { refreshToken });
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
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

const logoutUser = async (req, res) => {
  const { cookies } = req;
  const refreshToken = cookies.jwt;
  if (!refreshToken) {
    return res.sendStatus(204);
  }
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204);
  }
  await User.findByIdAndUpdate(
    user._id,
    { refreshToken: '' },
    {
      new: true,
      runValidators: true,
    },
  );
  res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // add secure: true in production to make it work with https only
  res.sendStatus(204);
};

module.exports = {
  loginUser,
  authenticateToken,
  createUser,
  generateNewAccessToken,
  logoutUser,
};
