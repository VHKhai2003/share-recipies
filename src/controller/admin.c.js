const { getNumOfRecipes, getRecipes, getRecipeById, changeRecipeStatus } = require("../database/queries");
const CustomError = require("../middleware/custom-error");

const getAllRecipesHandler = async (req, res, next) => {
    try {
        const category = req.query.category || 'all';
        let page = req.query.page || 1;
        page = parseInt(page);
        const keyword = req.query.keyword || null;
        const status = req.query.status || null; // (Approved, Rejected, null, Pending)
        // get total matching recipes
        const recipeCount = await getNumOfRecipes(category, status, keyword);

        let perPage = req.query.perPage || '10';
        perPage = parseInt(perPage);
        const sortBy = req.query.sortBy || 'date'; // sort by date or rating
        let recipeData = await getRecipes(page, perPage, sortBy, category, status, keyword);

        //Response
        res.json({
            status: 200,
            message: 'Get recipes successfully',
            data: recipeData,
            metaData: {
                page, 
                perPage,
                total: recipeCount,
                totalPage: recipeCount % perPage === 0 ? Math.floor(recipeCount / perPage) : Math.floor(recipeCount / perPage) + 1,
                sortBy,
                category,
                keyword,
                status,
            }, 
        });
    } catch (err) {
        console.log(err);
        next(new CustomError('Failed to get recipes', 500));
    }
}

// reject or approve a recipe
const changeRecipeStatusHandler = async (req, res, next) => {
    const userId = req.user.userid;
    const recipeId = req.params.recipeId;
    const newStatus = req.body.status;

    try {
        const recipe = await getRecipeById(recipeId);
        // validate
        if(!recipe) {
            return next(new CustomError('Recipe not found', 404));
        }
        if(recipe.status === newStatus) {
            return next(new CustomError('Invalid status', 400));
        }

        let approvedBy = null;
        if (newStatus === 'Approved') {
            approvedBy = userId
        }
        await changeRecipeStatus(recipeId, newStatus, approvedBy);

        res.json({
            status: 200,
            message: 'Update status successfully',
        });
    }
    catch (err) {
        console.log(err);
        next(new CustomError('Failed to update recipe status', 500));
    }
}

module.exports = {
    getAllRecipesHandler, changeRecipeStatusHandler,
}