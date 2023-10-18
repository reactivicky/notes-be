const express = require('express');
const { createUser, getAllUsers } = require('../controllers/usersController');

const router = express.Router();

router.route('/signup').post(createUser);
router.route('/').get(getAllUsers);

module.exports = router;
