const express = require('express');
const { getAllUsers, getUser } = require('../controllers/usersController');
const {
  createUser,
  loginUser,
  authenticateToken,
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(createUser);
router.route('/login').post(loginUser);
router.route('/').get(authenticateToken, getAllUsers);
router.route('/:id').get(getUser);

module.exports = router;
