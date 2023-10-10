const express = require('express');
const { getAllNotes, createNote } = require('../controllers/notesController');

const router = express.Router();

router.route('/').get(getAllNotes).post(createNote);

module.exports = router;
