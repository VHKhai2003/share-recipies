const express = require('express');
const { updateUserInfoHandler, getUserInfoHandler, getAllRecipesOfUserHandler } = require('../controller');
const { uploadAvatar } = require('../middleware/multer');
const { isAuthenticated } = require('../middleware/authentication');

const userRouter = express.Router();

userRouter.use(isAuthenticated)
    .get('', getUserInfoHandler)
    .get('/recipes', getAllRecipesOfUserHandler)
    .put('/:userId', uploadAvatar.single('avatar'), updateUserInfoHandler);

module.exports = userRouter;
