const Note = require('../models/noteModel');

const getAllNotes = async (req, res) => {
  const {
    text = '',
    sort = '-createdAt,_id',
    limit = 8,
    page = 1,
    select = '',
  } = req.query;
  const { userId } = req;
  const fields = select.split(',').join(' ');
  const sortBy = sort.split(',').join(' ');
  const skip = (page - 1) * limit;

  try {
    const notes = await Note.find({
      $or: [
        { name: { $in: [new RegExp(text, 'i')] } },
        { description: { $in: [new RegExp(text, 'i')] } },
      ],
      author: userId,
    })
      .select(fields)
      .sort(sortBy)
      .limit(limit)
      .skip(skip);
    res.status(200).json({
      status: 'success',
      resultCount: notes.length,
      end: notes.length < limit,
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
    const { userId } = req;
    const newNote = await Note.create({
      name,
      description,
      author: userId,
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

const getNote = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  try {
    const note = await Note.findOne({ _id: id, author: userId });
    if (!note) {
      return res.status(404).json({
        status: 'failed',
        message: 'Something went wrong',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        note,
      },
    });
  } catch (exports) {
    res.status(404).json({
      status: 'failed',
      message: `No note with id ${id}`,
    });
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, author: userId },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!note) {
      return res.status(404).json({
        status: 'failed',
        message: 'Something went wrong',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        note,
      },
    });
  } catch (exports) {
    res.status(404).json({
      status: 'failed',
      message: `No note with id ${id}`,
    });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      author: userId,
    });
    if (!deletedNote) {
      return res.status(404).json({
        status: 'failed',
        message: 'Something went wrong',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (exports) {
    res.status(404).json({
      status: 'failed',
      message: `No note with id ${id}`,
    });
  }
};

module.exports = {
  getAllNotes,
  createNote,
  getNote,
  deleteNote,
  updateNote,
};
