const express = require('express');
const {
  getAllNotes,
  createNote,
  getNote,
  deleteNote,
} = require('../controllers/notesController');

const router = express.Router();

router.route('/').get(getAllNotes).post(createNote);
router.route('/:id').get(getNote).delete(deleteNote);

module.exports = router;
