const express = require('express');
const { isAdmin } = require('../middleware/authorization');
const { getAllRecipesHandler, changeRecipeStatusHandler } = require('../controller/admin.c');

// admin router for update status of the recipe (rejected, approved)
const adminRouter = express.Router();

adminRouter
    .use(isAdmin)
    .get('/recipe', getAllRecipesHandler)
    .post('/recipe/:recipeId', changeRecipeStatusHandler); // change status

module.exports = adminRouter;