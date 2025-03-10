const { getUserByUsername, addNewUser, getUserById, updateUserInfo, 
    getAllUsers, updateUserRole, updateUserStatus } = require('./users');
const { getRoleByRoleId, getAllRoles } = require('./roles');
const { getToken, addToken, deleteToken } = require('./tokens');
const { getRecipes, getRecipeById, getNumOfRecipes, getRecipesOfUser, 
    addNewRecipe, updateRecipe, changeRecipeStatus } = require('./recipies');
const { isInFavourites, getFavouriteRecipes, getDetailFavouriteRecipes, 
    addNewFavouriteRecipe, removeFavouriteRecipe } = require('./favorite');
const { getComments, addComment, updateComment, removeComment } = require('./comments');
const {rating, getNumberRatingOfRecipe, updateRating, getUserRatingofRecipe, 
    getRatingofUser, getAvgRatingOfRecipe} = require('./rating');


module.exports = {
    getUserByUsername, addNewUser, getUserById, updateUserInfo, getAllUsers, updateUserRole, updateUserStatus,
    getRoleByRoleId, getAllRoles,
    getToken, addToken, deleteToken,
    getRecipes, getRecipeById, getNumOfRecipes, getRecipesOfUser, addNewRecipe, updateRecipe, changeRecipeStatus,
    isInFavourites, getFavouriteRecipes, getDetailFavouriteRecipes, addNewFavouriteRecipe, removeFavouriteRecipe,
    getComments, addComment, updateComment, removeComment,
    rating, getNumberRatingOfRecipe, updateRating, getUserRatingofRecipe, getRatingofUser, getAvgRatingOfRecipe
}