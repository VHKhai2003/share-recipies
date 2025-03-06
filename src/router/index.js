const adminRouter = require('./admin.r');
const authRouter = require('./auth.r');
const recipeRouter = require('./recipe.r');
const userActionRouter = require('./user-action.r');
const userRouter = require('./user.r');

module.exports = {
    authRouter, userRouter, recipeRouter, userActionRouter, adminRouter,
}