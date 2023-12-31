const express = require('express');
const { getAllUsers, getUser } = require('../controllers/usersController');
const {
  createUser,
  loginUser,
  authenticateToken,
  generateNewAccessToken,
  logoutUser,
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/token').post(generateNewAccessToken);
router.route('/').get(authenticateToken, getAllUsers);
router.route('/:id').get(getUser);

module.exports = router;
