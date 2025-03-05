// for rating, comment, favorite

const express = require('express');
const { isAuthenticated } = require('../middleware/authentication');
const { addCommentHandler, updateCommentHandler, removeCommentHandler, getCommentsHandler, 
    getFavouriteRecipesHandler, addNewFavouriteRecipeHandler, removeRecipeFromFavouritesHandler, 
    getRatingOfRecipeHandler,
    ratingHandler} = require('../controller');

const userActionRouter = express.Router();

// comment
userActionRouter.get('/comment/:recipeId', getCommentsHandler);

userActionRouter.use(isAuthenticated);
userActionRouter.post('/comment/:recipeId', addCommentHandler)
    .put('/comment/:commentId', updateCommentHandler)
    .delete('/comment/:commentId', removeCommentHandler);


// favorite list
userActionRouter.get('/favorite', getFavouriteRecipesHandler)
    .post('/favorite', addNewFavouriteRecipeHandler)
    .delete('/favorite/:recipeId', removeRecipeFromFavouritesHandler);


// rating
userActionRouter.get('/rating/:recipeId',  getRatingOfRecipeHandler)
    .post('/rating/:recipeId', ratingHandler);


module.exports = userActionRouter;