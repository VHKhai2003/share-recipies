const { getAllUsers, getUserById, getRecipesOfUser, updateUserStatus } = require("../database/queries");
const CustomError = require("../middleware/custom-error");

const getAllUsersHandlers = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.json({
            status: 200,
            message: 'Get all users successfully',
            data: users,
        });
    }
    catch(err) {
        console.log(err);
        next(new CustomError('Failed to get all users', 500));
    }
}

const getUserProfileForAdminHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await getUserById(userId);
        if(user == null) {
            return next(new CustomError('User not found', 404));
        }
        delete user.password;
        const recipes = await getRecipesOfUser(userId);
        user.recipes = recipes;
        res.json({
            status: 200,
            message: 'Get user profile successfully',
            data: user,
        })
    }   
    catch(err) {
        next(new CustomError('Failed to get user profile', 500));
    }
    
}

const updateUserStatusHandler = async (req, res, next) => {
    const userId = req.params.userId;
    const newStatus = req.body.newStatus;
    if(newStatus !== 'Active' && newStatus !== 'Blocked') {
        return next(new CustomError('Invalid status', 400));
    }

    try {
        const user = await updateUserStatus(userId, newStatus);
        if(user) {
            delete user.password;
        }
        res.json({
            status: 200,
            message: 'Update status successfully',
            data: user,
        })
    }
    catch(err) {
        console.log(err);
        next(new CustomError('Failed to update status', 500));
    }
}


module.exports = {
    getAllUsersHandlers, getUserProfileForAdminHandler, updateUserStatusHandler,
}