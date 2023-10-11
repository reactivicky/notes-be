const express = require('express');
const {
  getAllNotes,
  createNote,
  getNote,
  deleteNote,
  updateNote,
} = require('../controllers/notesController');

const router = express.Router();

router.route('/').get(getAllNotes).post(createNote);
router.route('/:id').get(getNote).delete(deleteNote).patch(updateNote);

module.exports = router;
