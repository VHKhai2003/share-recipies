const express = require('express');
const { loginHandler, registerHanlder, logoutHandler, refreshTokenHandler } = require('../controller');
const { isAuthenticated } = require('../middleware/authentication');

const authRouter = express.Router();

authRouter.post('/login', loginHandler)
    .post('/register', registerHanlder)
    .post('/refresh-token', refreshTokenHandler)
    .post('/logout', isAuthenticated, logoutHandler);

module.exports = authRouter;