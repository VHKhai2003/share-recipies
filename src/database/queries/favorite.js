const postgres = require('../config');

const isInFavourites = async (userId, recipeId) => {
    const queryString = 'select * from FAVORITE where userId = $1 and recipeId = $2';
    const values = [userId, recipeId];
    const data = await postgres.query(queryString, values);
    return data.rowCount > 0;
}
// return list of recipe id
const getFavouriteRecipes = async (userId) => {
    const queryString = 'select RecipeId from FAVORITE where userId = $1';
    const values = [userId];
    const recipeData = await postgres.query(queryString, values);
    return formattedData = recipeData.rows;
}

// return list of recipe
const getDetailFavouriteRecipes = async (userId) => {
    let queryString = `select RECIPES.*, CATEGORIES.Name AS category , AVG(rating.rating) AS averagerating, COUNT(rating.rating)::integer AS reviews
                        \nfrom RECIPES join FAVORITE on RECIPES.RecipeId = FAVORITE.RecipeId and FAVORITE.UserId = $1
                        \nleft join CATEGORIES on RECIPES.Category = CATEGORIES.CategoryId
                        \nleft join RATING on RECIPES.RecipeId = RATING.RecipeId
                        \nwhere RECIPES.status = 'Approved'
                        \ngroup by RECIPES.RecipeId, RECIPES.Name, CATEGORIES.Name
                        \norder by DateSubmit Desc`;
    const values = [userId];
    const recipeData = await postgres.query(queryString, values);
    return recipeData.rows;
}


const addNewFavouriteRecipe = async (userId, recipeId) => {
    const queryString = 'insert into FAVORITE values($1, $2)';
    const values = [userId, recipeId]
    await postgres.query(queryString, values);
}

const removeFavouriteRecipe = async (userId, recipeId) => {
    const queryString = 'delete from FAVORITE where UserId = $1 and RecipeId = $2';
    const values = [userId, recipeId]
    await postgres.query(queryString, values);
}

module.exports = {
    isInFavourites, getFavouriteRecipes, getDetailFavouriteRecipes, addNewFavouriteRecipe, removeFavouriteRecipe,
}