const express = require('express');
const {
  createUser,
  getAllUsers,
  getUser,
  loginUser,
} = require('../controllers/usersController');

const router = express.Router();

router.route('/signup').post(createUser);
router.route('/login').post(loginUser);
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser);

module.exports = router;
