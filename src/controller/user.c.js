const fs = require('fs');
const path = require('path');
const CustomError = require('../middleware/custom-error');
const { emailValidate } = require('../utils/data-validation');
const { updateUserInfo } = require('../database/queries');

const getUserInfoHandler = async (req, res, next) => {
    res.json({
        status: 200,
        message: 'Get user info successfully',
        data: req.user,
    });
}

const updateUserInfoHandler = async (req, res, next) => {
    const userId = req.params.userId;
    const user = req.user;
    if(userId !== user.userid) {
        return next(new CustomError('Unauthorized', 401));
    }

    //validate
    const {name, email} = req.body;
    try {
        if(!name || !name.trim()) {
            throw new Error('Invalid name');
        }
        emailValidate(email)
    }
    catch(err) {
        console.log(err.message);
        if(req.file) {
            fs.unlinkSync(path.join(__dirname, `../public/avatars/${req.file.filename}`));
        }
        return next(new CustomError(err.message, 400));
    }

    const oldAvatar = user.avatar;
    // update info
    user.name = name;
    user.email = email;
    user.avatar = req.file?.filename ? `/avatars/${req.file.filename}` : oldAvatar;
    try {
        const userUpdated = await updateUserInfo(user);
        // delete old avatar
        if(oldAvatar !== '/avatars/default.png' && oldAvatar !== userUpdated?.avatar) {
            fs.unlinkSync(path.join(__dirname, `../public/${oldAvatar}` ));
        }
        res.json({
            status: 200,
            message: 'Update user info successfully',
            data: userUpdated,
        });
    }
    catch(err) {
        console.log(err);
        next(new CustomError('Failed to update user info', 500));
    }
}

module.exports = {
    updateUserInfoHandler, getUserInfoHandler,
}