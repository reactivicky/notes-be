const Note = require('../models/noteModel');

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({
      status: 'success',
      data: {
        notes,
      },
    });
  } catch (e) {
    res.status(404).json({
      status: 'failed',
      message: 'No notes found',
    });
  }
};

const createNote = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newNote = await Note.create({
      name,
      description,
    });
    res.status(201).json({
      status: 'success',
      data: {
        note: newNote,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'failed',
      message: e.message,
    });
  }
};

module.exports = {
  getAllNotes,
  createNote,
};
