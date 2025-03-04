const { getNumOfRecipes, getRecipes, getRecipeById, getUserById, isInFavourites, addNewRecipe, updateRecipe } = require('../database/queries');
const CustomError = require('../middleware/custom-error');
const { uuidValidate } = require('../utils/data-validation');

// get all approved recipes
const getRecipesHandler = async (req, res, next) => {
    try {
        const category = req.query.category || 'all';
        let page = req.query.page || 1;
        page = parseInt(page);
        const keyword = req.query.keyword || null;
        const status = 'Approved';
        // get total matching recipes
        const recipeCount = await getNumOfRecipes(category, status, keyword);

        let perPage = req.query.perPage || '10';
        perPage = parseInt(perPage);
        const sortBy = req.query.sortBy || 'date'; // sort by date or rating
        let recipeData = await getRecipes(page, perPage, sortBy, category, status, keyword);

        // add field isFavourite
        const userData = req.user;
        if (userData) {
            const favouriteRecipes = await getNumOfRecipes(userData.userid)
            for (const r of recipeData) {
                r.isfavourite = favouriteRecipes.some(fav => fav.recipeid === r.recipeid);
            }
        } else {
            for (const r of recipeData) {
                r.isfavourite = false;
            }
        }

        //Response
        res.json({
            status: 200,
            message: 'Get recipe successfully',
            data: recipeData,
            metaData: {
                page, 
                perPage,
                total: recipeCount,
                totalPage: recipeCount % perPage === 0 ? Math.floor(recipeCount / perPage) : Math.floor(recipeCount / perPage) + 1,
                sortBy,
                category,
                keyword,
            }, 
        });
    } catch (err) {
        console.log(err);
        next(new CustomError('Failed to get recipes', 500));
    }
}

// get specific recipe by id
const getRecipeByIdHandler = async (req, res, next) => {
    const id = req.params.id;
    try {
        // validate uuid
        try {
            uuidValidate(id);
        }
        catch(err) {
            return next(new CustomError(err.message, 400));
        }
        const recipeData = await getRecipeById(id);
        if (!recipeData) {
            return next(new CustomError('Recipe not found', 404));
        }
        const authorData = await getUserById(recipeData.author);
        recipeData.author = {
            id: authorData.userid,
            name: authorData.name,
            avatar: authorData.avatar,
            email: authorData.email,
        }
        
        //check user
        const userData = req.user
        if (!userData) {
            if (recipeData.status !== 'Approved') {
                return next(new CustomError('Not appropriate privileges', 403));
            }
            recipeData.isfavourite = false
        } else {
            if (userData.role === 1 && userData.userid !== recipeData.author.id && recipeData.status !== 'Approved') {
                return next(new CustomError('Not appropriate privileges', 403));
            }
            const isFavourite = await isInFavourites(userData.userid, id)
            recipeData.isfavourite = isFavourite
        }
        res.json({
            status: 200,
            message: 'Get recipe successfully',
            data: recipeData
        })
    }
    catch (err) {
        console.log(err);
        next(new CustomError('Failed to get recipes', 500));
    }
}

const addNewRecipeHandler = async (req, res, next) => {
    const userId = req.user.userid;
    try {
        // {name, description, estimatedTime, ingredients,instruction, category}
        let recipe = req.body;
        if(!recipe.name || !recipe.description || !recipe.estimatedtime || !recipe.ingredients || !recipe.instruction || !recipe.category) {
            return next(new CustomError('Invalid data', 400));
        }
        recipe.author = userId;
        if(req.file) {
            recipe.recipeavatar = `/pictures/${req.file.filename}`;
        }
        recipe = await addNewRecipe(recipe);
        res.json({
            status: 200,
            message: 'Add new recipe successfully',
            data: recipe,
        })
    }
    catch (err) {
        console.log(err);
        next(new CustomError('Failed to add new recipe', 500));
    }
}


const updateRecipeHandler = async (req, res, next) => {
    const userId = req.user.userid;
    const recipeId = req.params.id;
    // validate id
    try {
        uuidValidate(recipeId);
    }
    catch(err) {
        return next(new CustomError(err.message, 400));
    }

    try {
        const recipe = await getRecipeById(recipeId);
        if(!recipe) {
            return next(new CustomError('Recipe not found', 404));
        }
        // only author can update
        if(recipe.author !== userId) {
            return next(new CustomError('Not appropriate privileges', 403));
        }
        
        recipe.description = req.body.description || recipe.description;
        recipe.estimatedtime = req.body.estimatedtime || recipe.estimatedtime;
        recipe.ingredients = req.body.ingredients || recipe.ingredients;
        recipe.instruction = req.body.instruction || recipe.instruction;
        await updateRecipe(recipe);

        res.json({
            status: 200,
            message: 'update recipe successfully',
            data: recipe,
        })
    }
    catch (err) {
        console.log(err);
        next(new CustomError('Failed to update recipe', 500));
    }
}


module.exports = {
    getRecipesHandler, getRecipeByIdHandler, addNewRecipeHandler, updateRecipeHandler
}