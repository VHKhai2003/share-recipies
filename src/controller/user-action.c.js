const CustomError = require('../middleware/custom-error');
const { getComments, addComment, removeComment, updateComment, 
    addNewFavouriteRecipe, getDetailFavouriteRecipes, getRecipeById, isInFavourites, removeFavouriteRecipe, 
    rating, getNumberRatingOfRecipe, updateRating, getUserRatingofRecipe, getRatingofUser, getAvgRatingOfRecipe } = require('../database/queries');
const { uuidValidate } = require('../utils/data-validation');


//get comments
const getCommentsHandler = async (req, res, next) => {
    try {
        let page = req.query.page || 1;
        page = parseInt(page);
        let perPage = req.query.perPage || 10;
        perPage = parseInt(perPage);
        const sortBy = req.query.sortBy || 'newest'; // newest or oldest
        let recipeId = req.params.recipeId;
        try {
            recipeId = uuidValidate(recipeId);
        }
        catch(err) {
            return next(new CustomError('Id of the recipe is invalid', 400));
        }
        //get comments data
        const commentsData = await getComments(recipeId, page, perPage, sortBy);

        //Response
        if(commentsData.data.length == 0){
            commentsData.message = 'No comments';
        }
        else{
            commentsData.message = 'get comment successfully';
        }
        commentsData.status = 200;
        res.status(200).json(commentsData);
    } catch (err) {
        console.log(err);
        next(new CustomError('Failed to get comments', 500));
    }
}



//add comment controller
const addCommentHandler = async (req, res, next) => {
    try {
        //get information
        let recipeId = req.params.recipeId;
        try {
            recipeId = uuidValidate(recipeId);
        }
        catch(err) {
            return next(new CustomError('Id of the recipe is invalid', 400));
        }
        const content = req.body.content || '';
        const userId = req.user.userid;
        // reply to comment id
        let replyTo = req.body.replyto;

        //insert into databse
        const comment = await addComment(recipeId, userId, content, replyTo);
        res.json({
            status: 200,
            message: 'add comment successfully',
            data: comment,
        });

    }
    catch(err) {
        console.log(err);
        next(new CustomError('Failed to add comment', 500));
    }
}

//remove comment controller
const removeCommentHandler = async (req, res, next) => {
    try {
        let commentId = req.params.commentId;
        try {
            commentId = uuidValidate(commentId);
        }
        catch(err) {
            return next(new CustomError('Id of the comment is invalid', 400));
        }
        const userId = req.user.userid;
        
        //delete from comments
        await removeComment(commentId, userId);
        res.json({
            status: 200,
            message: 'remove comment successfully'
        });

    }
    catch(err) {
        console.log(err);
        next(new CustomError('Failed to delete comments', 500));
    }
}


//update comment
const updateCommentHandler = async (req, res) => {
    try {
        let commentId = req.params.commentId;
        try {
            commentId = uuidValidate(commentId);
        }
        catch(err) {
            return next(new CustomError('Id of the comment is invalid', 400));
        }
        const userId = req.user.userid;
        //get content
        const newContent = req.body.content || '';
        
        //delete from comments
        const comment = await updateComment(commentId, userId, newContent);
        res.json({
            status: 200,
            message: 'update successfully',
            data: comment,
        });

    }
    catch(err) {
        console.log(err);
        next(new CustomError('Failed to update comment', 500));
    }
}





// get favorite list
const getFavouriteRecipesHandler = async (req, res, next) => {
    const userId = req.user.userid;
    try {
        const favouriteRecipes = await getDetailFavouriteRecipes(userId);
        res.json({
            status: 200,
            message: 'Get favorite recipes successfully',
            data: favouriteRecipes,
        })
    }
    catch (err) {
        console.log(err);
        next(new CustomError('Failed to get favorite recipes', 500));
    }
}

const addNewFavouriteRecipeHandler = async (req, res, next) => {
    const userId = req.user.userid;
    let recipeId = req.body.recipeid;
    // validate
    try {
        recipeId = uuidValidate(recipeId);
    }
    catch(err) {
        return next(new CustomError('Invalid recipe id', 400));
    }

    try {
        const recipeData = await getRecipeById(recipeId)
        if (!recipeData) {
            return next(new CustomError('Recipe not found', 404));
        }
        const isInFavouriteRecipes = await isInFavourites(userId, recipeId)
        if (isInFavouriteRecipes) {
            return next(new CustomError('Favorite recipe is already existed'));
        }

        await addNewFavouriteRecipe(userId, recipeId)

        res.json({
            status: 200,
            message: 'Add to favorite list successfullly',
        })
    }
    catch (err) {
        console.log(err);
        next(new CustomError('Failed to add recipe to favorited list', 500));
    }
}

const removeRecipeFromFavouritesHandler = async (req, res) => {
    const userId = req.user.userid
    const recipeId = req.params.recipeId;
    try {
        await removeFavouriteRecipe(userId, recipeId)
        res.json({
            status: 200,
            message: 'Remove successfully',
        })
    }
    catch (err) {
        console.log(err);
        next(new CustomError('Failed to remove recipe from favorited list', 500));
    }
}



// rating

const ratingHandler = async (req, res, next) => {
    const userId = req.user.userid;
    let recipeId = req.params.recipeId;
    const rate = req.body.rating;
    try {
        recipeId = uuidValidate(recipeId);
    }
    catch(err) {
        return next(new CustomError(err.message, 400));
    }

    try {
        const rated = await getRatingofUser(userId, recipeId);
        if(rated != 0) {
            await updateRating(userId, recipeId, rate);
        }
        else {
            await rating(userId, recipeId, rate);
        }
        
        res.json({
            status: 200,
            message: 'rating successfully',
        });
    } catch (err) {
        console.log(err);
        next(new CustomError('Failed to rating', 500));
    }
}

//get
const getRatingOfRecipeHandler = async (req, res, next) => {
    const userId = req.user.userid;
    let recipeId = req.params.recipeId;
    try {
        recipeId = uuidValidate(recipeId);
    }
    catch(err) {
        return next(new CustomError(err.message, 400));
    }
    try {
        const userCount = await getNumberRatingOfRecipe(recipeId);
        const userData = await getUserRatingofRecipe(recipeId);
        const rated = await getRatingofUser(userId, recipeId);
        const avg = await getAvgRatingOfRecipe(recipeId);
        res.json({
            status: 200,
            message: 'Get rating infor successfully',
            data: {
                total: userCount,
                userData: userData,
                average: avg,
                rated: rated
            },
        });
    } catch (err) {
        console.log(err);
        next(new CustomError('Failed to get rating infor', 500));
    }
}




module.exports = { 
    getCommentsHandler, addCommentHandler, removeCommentHandler, updateCommentHandler,
    getFavouriteRecipesHandler, addNewFavouriteRecipeHandler, removeRecipeFromFavouritesHandler,
    ratingHandler, getRatingOfRecipeHandler,
}
