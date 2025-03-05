const postgres = require('../config');

const rating = async (userId, recipeId, rating) => {
    const queryString = 'insert into rating values ($1, $2, $3)';
    const values = [userId, recipeId, rating];
    await postgres.query(queryString, values);
}

const getNumberRatingOfRecipe = async (recipeId) => {
    const queryString = 'select count(rating) from rating where recipeid = $1';
    const values = [recipeId];
    const result = await postgres.query(queryString, values);
    if (result.rowCount > 0) {
        return Number(result.rows[0].count);
    }
    else {
        return 0;
    }
}

const getAvgRatingOfRecipe = async (recipeId) => {
    const queryString = 'select avg(rating) from rating where recipeid = $1';
    const values = [recipeId];
    const result = await postgres.query(queryString, values);
    if (result.rowCount > 0) {
        return Number(result.rows[0].avg);
    }
    else {
        return 0;
    }
}

const updateRating = async (userId, recipeId, rating) => {
    const queryString = `update rating
                        \nset rating = $1
                        \nwhere userId = $2 and recipeId = $3`;
    const values = [rating, userId, recipeId];
    await postgres.query(queryString, values);
}

const getUserRatingofRecipe = async (recipedId) => {
    const queryString = `SELECT Users.avatar, Users.name, Rating
                        \nFROM Rating join Users on Rating.UserId = Users.UserId
                        \nWHERE Rating.RecipeId = $1`;
    const values = [recipedId];
    const result = await postgres.query(queryString, values);
    return result.rows;
}

const getRatingofUser = async (userId, recipeId) => {
    const queryString = 'SELECT rating FROM rating WHERE userId = $1 and recipeId = $2';
    const values = [userId, recipeId];
    const result = await postgres.query(queryString, values);
    if (result.rowCount > 0) {
        return result.rows[0].rating;
    }
    else {
        return 0;
    }
}





module.exports = { rating, getNumberRatingOfRecipe, updateRating, getUserRatingofRecipe, getRatingofUser, getAvgRatingOfRecipe }