const express = require('express');
const { updateUserInfoHandler, getUserInfoHandler } = require('../controller');
const { uploadAvatar } = require('../middleware/multer');
const { isAuthenticated } = require('../middleware/authentication');

const userRouter = express.Router();

userRouter.use(isAuthenticated)
    .get('', getUserInfoHandler)
    .put('/:userId', uploadAvatar.single('avatar'), updateUserInfoHandler);

module.exports = userRouter;
