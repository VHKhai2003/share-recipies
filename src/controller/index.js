const { loginHandler, registerHanlder, logoutHandler, refreshTokenHandler } = require('./auth.c');
const { getRecipesHandler, getRecipeByIdHandler, updateRecipeHandler, addNewRecipeHandler } = require('./recipe.c');
const { updateUserInfoHandler, getUserInfoHandler } = require('./user.c');

module.exports = {
    loginHandler, registerHanlder, logoutHandler, refreshTokenHandler,
    updateUserInfoHandler, getUserInfoHandler,
    getRecipesHandler, getRecipeByIdHandler, updateRecipeHandler, addNewRecipeHandler
}