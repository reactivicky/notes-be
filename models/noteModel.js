const mongoose = require('mongoose');
// const validator = require('validator');

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Note should have a name!'],
    trim: true,
    maxlength: [40, 'A tour name must be less than or eqaul to 40 characters'],
    minlength: [10, 'A tour name must be more than or eqaul to 10 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Note', noteSchema);