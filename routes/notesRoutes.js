const express = require('express');
const {
  getAllNotes,
  createNote,
  getNote,
} = require('../controllers/notesController');

const router = express.Router();

router.route('/').get(getAllNotes).post(createNote);
router.route('/:id').get(getNote);

module.exports = router;
