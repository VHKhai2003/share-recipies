const authRouter = require('./auth.r');
const recipeRouter = require('./recipe.r');
const userRouter = require('./user.r');

module.exports = {
    authRouter, userRouter, recipeRouter,
}