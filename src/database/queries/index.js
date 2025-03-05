const { getUserByUsername, addNewUser, getUserById, updateUserInfo } = require('./users');
const { getRoleByRoleId, getAllRoles } = require('./roles');
const { getToken, addToken, deleteToken } = require('./tokens');
const { getRecipes, getRecipeById, getNumOfRecipes, getRecipesOfUser, addNewRecipe, updateRecipe } = require('./recipies');
const { isInFavourites, getFavouriteRecipes, getDetailFavouriteRecipes, addNewFavouriteRecipe, removeFavouriteRecipe } = require('./favorite');
const { getComments, addComment, updateComment, removeComment } = require('./comments');
const {rating, getNumberRatingOfRecipe, updateRating, getUserRatingofRecipe, getRatingofUser, getAvgRatingOfRecipe} = require('./rating');


module.exports = {
    getUserByUsername, addNewUser, getUserById, updateUserInfo,
    getRoleByRoleId, getAllRoles,
    getToken, addToken, deleteToken,
    getRecipes, getRecipeById, getNumOfRecipes, getRecipesOfUser, addNewRecipe, updateRecipe,
    isInFavourites, getFavouriteRecipes, getDetailFavouriteRecipes, addNewFavouriteRecipe, removeFavouriteRecipe,
    getComments, addComment, updateComment, removeComment,
    rating, getNumberRatingOfRecipe, updateRating, getUserRatingofRecipe, getRatingofUser, getAvgRatingOfRecipe
}