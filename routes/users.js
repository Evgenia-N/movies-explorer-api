const express = require('express');

const userRoutes = express.Router();

// const auth = require('../middlewares/auth');

// const { validateUserInfo } = require('../middlewares/validation');

const { getThisUser, updateUser } = require('../controllers/users');

userRoutes.get('/users/me', auth, getThisUser);
userRoutes.patch('/users/me', auth, express.json(), validateUserInfo, updateUser);

module.exports = userRoutes;
