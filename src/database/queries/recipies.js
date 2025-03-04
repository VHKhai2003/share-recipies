const postgres = require('../config');

const getRecipes = async (page, perPage, sortBy, category, status = 'Approved', keyword) => {

    let queryString = `select RECIPES.*, CATEGORIES.Name AS category , COALESCE(ROUND(AVG(rating.rating), 1), 0)::float AS averagerating, COUNT(rating.rating)::integer AS reviews
                        \nfrom RECIPES left join CATEGORIES on RECIPES.Category = CATEGORIES.CategoryId
                        \nleft join RATING on RECIPES.RecipeId = RATING.RecipeId
                        \nleft join USERS on RECIPES.Author = USERS.UserId
                        \nwhere RECIPES.Status != 'Deleted' and USERS.Status = 'Active' `;
    let values = [(page - 1) * perPage, perPage, status];
    // filter by category
    if (category !== 'all') {
        queryString += '\nand CATEGORIES.CategoryId = $4';
        values.push(category);
    }

    // search by keyword
    if (keyword) {
        if (category !== 'all') {
            queryString += '\nand LOWER(RECIPES.Name) like LOWER($5)';
        } else {
            queryString += '\nand LOWER(RECIPES.Name) like LOWER($4)';
        }
        values.push(`%${keyword}%`);
    }

    queryString += "\nand RECIPES.status = $3";
    queryString += '\ngroup by RECIPES.RecipeId, CATEGORIES.Name, USERS.UserId';
    // sort
    queryString += sortBy === 'date' ? '\norder by DateSubmit Desc' : '';
    queryString += sortBy === 'rating' ? '\norder by AVG(rating.rating) Desc nulls last' : '';
    queryString += '\noffset $1\nlimit $2';

    const recipeData = await postgres.query(queryString, values);
    return recipeData.rows;
}

const getRecipeById = async (recipeId) => {
    const queryString = `select RECIPES.*, CATEGORIES.Name AS category, COALESCE(ROUND(AVG(rating.rating), 1), 0)::float AS averagerating, COUNT(rating.rating)::integer AS reviews
                        \nfrom RECIPES left join CATEGORIES on RECIPES.Category = CATEGORIES.CategoryId
                        \nleft join RATING on RECIPES.RecipeId = RATING.RecipeId
                        \nleft join USERS on RECIPES.Author = USERS.UserId
                        \nwhere RECIPES.RecipeId = $1 and RECIPES.Status != 'Deleted' and USERS.Status = 'Active'
                        \ngroup by RECIPES.RecipeId, CATEGORIES.Name `;
    const values = [recipeId];
    const recipeData = await postgres.query(queryString, values);
    return recipeData.rowCount > 0 ? recipeData.rows[0] : null;

}

const getNumOfRecipes = async (category = 'all', status = 'Approved', keyword, year, userId) => {
    let queryString = `select count(*)
                        \nfrom RECIPES left join CATEGORIES on RECIPES.Category = CATEGORIES.CategoryId
                        \nleft join USERS on RECIPES.Author = USERS.UserId
                        \nwhere RECIPES.Status != 'Deleted' and USERS.Status = 'Active'`;
    let values = [status];
    let setClauses = [];
    if (category !== 'all') {
        setClauses.push('\nand CATEGORIES.CategoryId = $' + (setClauses.length + 2));
        values.push(category);
    }

    if (keyword) {
        setClauses.push('\nand LOWER(RECIPES.Name) like LOWER($' + (setClauses.length + 2) + ')');
        values.push(`%${keyword}%`);
    }

    if (year) {
        setClauses.push('\nand EXTRACT(YEAR FROM RECIPES.datesubmit) = $' + (setClauses.length + 2));
        values.push(year);
    }

    if (userId) {
        setClauses.push('\nand USERS.UserId = $' + (setClauses.length + 2));
        values.push(userId);
    }
    queryString += setClauses.join(' ');

    queryString += "\nand RECIPES.status = $1";

    const recipeData = await postgres.query(queryString, values);
    return parseInt(recipeData.rows[0].count);
}

// get by userID and recipe status
const getRecipesOfUser = async (userId, recipeStatus) => {
    let queryString = `select RECIPES.*, CATEGORIES.Name AS category , COALESCE(ROUND(AVG(rating.rating), 1), 0)::float AS averagerating, COUNT(rating.rating)::integer AS reviews
                        \nfrom RECIPES left join CATEGORIES on RECIPES.Category = CATEGORIES.CategoryId
                        \nleft join RATING on RECIPES.RecipeId = RATING.RecipeId
                        \nleft join USERS on RECIPES.Author = USERS.UserId
                        \nwhere USERS.Status = 'Active' and RECIPES.Author = $1`;
    let values = [userId]

    if (recipeStatus) {
        queryString += ' and RECIPES.Status = $2';
        values.push(recipeStatus);
    }
    queryString += '\ngroup by RECIPES.RecipeId, CATEGORIES.Name'

    const recipeData = await postgres.query(queryString, values);
    return recipeData.rows;
}


const addNewRecipe = async (recipe) => {
    const queryString = `insert into RECIPES(name, author, description, estimatedtime, ingredients, instruction, category, recipeavatar)
                        \nvalues($1, $2, $3, $4, $5, $6, $7, $8) returning *`
    const values = [recipe.name, recipe.author, recipe.description, recipe.estimatedtime, recipe.ingredients, recipe.instruction, recipe.category, recipe.recipeavatar]

    const recipeData = await postgres.query(queryString, values);
    return recipeData.rowCount > 0 ? recipeData.rows[0] : null;
}

const updateRecipe = async (recipe) => {
    const queryString = `update RECIPES set description = $2, estimatedtime = $3, ingredients = $4, instruction = $5 where RecipeId = $1`
    let values = [recipe.recipeid, recipe.description, recipe.estimatedtime, recipe.ingredients, recipe.instruction];
    await postgres.query(queryString, values);
}


module.exports = {
    getRecipes, getRecipeById, getNumOfRecipes, getRecipesOfUser, addNewRecipe, updateRecipe
}