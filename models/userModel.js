const mongoose = require('mongoose');
// const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'User should have a name!'],
      trim: true,
      maxlength: [40, 'A username must be less than or eqaul to 40 characters'],
      minlength: [5, 'A tour name must be more than or eqaul to 10 characters'],
      unique: [true, 'Username already exists'],
    },
    password: {
      type: String,
      trim: true,
      minlength: [6, 'A password must be more than or eqaul to 6 characters'],
      select: false,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
  },
);

module.exports = mongoose.model('User', userSchema);
