const express = require('express');

const userRoutes = express.Router();

const auth = require('../middlewares/auth');

// const {
//  validateUserInfo, validateLogin, validateRegister, validateLogout,
// } = require('../middlewares/validation');

const {
  getThisUser, updateUser, login, createUser, logout,
} = require('../controllers/users');

userRoutes.get('/users/me', auth, getThisUser);
userRoutes.patch('/users/me', auth, express.json(), validateUserInfo, updateUser);
userRoutes.post('/signin', express.json(), validateLogin, login);
userRoutes.post('/signup', express.json(), validateRegister, createUser);
userRoutes.post('/signout', auth, express.json(), validateLogout, logout);

module.exports = userRoutes;
