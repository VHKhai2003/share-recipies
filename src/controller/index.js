const { getAllRecipesHandler, changeRecipeStatusHandler } = require('./admin.c');
const { loginHandler, registerHanlder, logoutHandler, refreshTokenHandler } = require('./auth.c');
const { getRecipesHandler, getRecipeByIdHandler, updateRecipeHandler, addNewRecipeHandler } = require('./recipe.c');
const { getAllUsersHandlers, getUserProfileForAdminHandler, updateUserStatusHandler } = require('./super-admin.c');
const { getCommentsHandler, addCommentHandler, removeCommentHandler, updateCommentHandler, 
    getFavouriteRecipesHandler, addNewFavouriteRecipeHandler, removeRecipeFromFavouritesHandler, 
    ratingHandler, getRatingOfRecipeHandler} = require('./user-action.c');
const { updateUserInfoHandler, getUserInfoHandler, getAllRecipesOfUserHandler } = require('./user.c');

module.exports = {
    loginHandler, registerHanlder, logoutHandler, refreshTokenHandler,
    updateUserInfoHandler, getUserInfoHandler, getAllRecipesOfUserHandler,
    getRecipesHandler, getRecipeByIdHandler, updateRecipeHandler, addNewRecipeHandler,
    getCommentsHandler, addCommentHandler, removeCommentHandler, updateCommentHandler,
    getFavouriteRecipesHandler, addNewFavouriteRecipeHandler, removeRecipeFromFavouritesHandler,
    ratingHandler, getRatingOfRecipeHandler,
    getAllRecipesHandler, changeRecipeStatusHandler,
    getAllUsersHandlers, getUserProfileForAdminHandler, updateUserStatusHandler,
}