const postgres = require('../config');

const isInFavourites = async (userId, recipeId) => {
    const queryString = 'select * from FAVORITE where userId = $1 and recipeId = $2';
    const values = [userId, recipeId];
    const data = await postgres.query(queryString, values);
    return data.rowCount > 0;
}

const getFavouriteRecipes = async (userId) => {
    const queryString = 'select RecipeId from FAVORITE where userId = $1';
    const values = [userId]
    const recipeData = await postgres.query(queryString, values);
    return formattedData = recipeData.rows;
}

module.exports = {
    isInFavourites, getFavouriteRecipes,
}