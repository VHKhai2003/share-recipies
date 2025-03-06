const { getAllRecipesHandler, changeRecipeStatusHandler } = require('./admin.c');
const { loginHandler, registerHanlder, logoutHandler, refreshTokenHandler } = require('./auth.c');
const { getRecipesHandler, getRecipeByIdHandler, updateRecipeHandler, addNewRecipeHandler } = require('./recipe.c');
const { getCommentsHandler, addCommentHandler, removeCommentHandler, updateCommentHandler, 
    getFavouriteRecipesHandler, addNewFavouriteRecipeHandler, removeRecipeFromFavouritesHandler, 
    ratingHandler, getRatingOfRecipeHandler} = require('./user-action.c');
const { updateUserInfoHandler, getUserInfoHandler } = require('./user.c');

module.exports = {
    loginHandler, registerHanlder, logoutHandler, refreshTokenHandler,
    updateUserInfoHandler, getUserInfoHandler,
    getRecipesHandler, getRecipeByIdHandler, updateRecipeHandler, addNewRecipeHandler,
    getCommentsHandler, addCommentHandler, removeCommentHandler, updateCommentHandler,
    getFavouriteRecipesHandler, addNewFavouriteRecipeHandler, removeRecipeFromFavouritesHandler,
    ratingHandler, getRatingOfRecipeHandler,
    getAllRecipesHandler, changeRecipeStatusHandler,
}