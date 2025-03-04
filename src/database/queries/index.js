const { getUserByUsername, addNewUser, getUserById, updateUserInfo } = require('./users');
const { getRoleByRoleId, getAllRoles } = require('./roles');
const { getToken, addToken, deleteToken } = require('./tokens');
const { getRecipes, getRecipeById, getNumOfRecipes, getRecipesOfUser, addNewRecipe, updateRecipe } = require('./recipies');
const { isInFavourites, getFavouriteRecipes } = require('./favorite');


module.exports = {
    getUserByUsername, addNewUser, getUserById, updateUserInfo,
    getRoleByRoleId, getAllRoles,
    getToken, addToken, deleteToken,
    getRecipes, getRecipeById, getNumOfRecipes, getRecipesOfUser, addNewRecipe, updateRecipe,
    isInFavourites, getFavouriteRecipes,
}