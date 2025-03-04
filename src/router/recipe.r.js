const express = require('express');
const { getRecipeByIdHandler, getRecipesHandler, addNewRecipeHandler, updateRecipeHandler } = require('../controller');
const {uploadPicture} = require('../middleware/multer');
const { isAuthenticated } = require('../middleware/authentication');

const recipeRouter = express.Router();

recipeRouter.get('/', getRecipesHandler)
    .get('/:id', getRecipeByIdHandler);

// add and update
recipeRouter.use(isAuthenticated)
    .post('/', uploadPicture.single('photo'), addNewRecipeHandler)
    .put('/:id', updateRecipeHandler);

module.exports = recipeRouter;