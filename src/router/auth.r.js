const express = require('express');
const { loginHandler, registerHanlder } = require('../controller');

const authRouter = express.Router();

authRouter.post('/login', loginHandler)
    .post('/register', registerHanlder);

module.exports = authRouter;