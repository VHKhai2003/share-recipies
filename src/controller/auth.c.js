const bcrypt = require('bcrypt');
const { getUserByUsername, addNewUser, getRoleByRoleId, addToken, getToken } = require('../database/queries');
const CustomError = require('../middleware/custom-error');
const { usernameValidate, passwordValidate, emailValidate } = require('../utils/data-validation');
const { generateAccessToken, generateRefreshToken, getObjectFromToken } = require('../utils/token');
const saltRounds = 10;

const loginHandler = async (req, res, next) => {
    const username = req.body.username || '';
    const password = req.body.password || '';
    if(username && password) {
        try {
            const user = await getUserByUsername(username);
            // console.log(user);
            if(user) {
                if(bcrypt.compareSync(password, user.password)) {
                    // generate token
                    const accessToken = generateAccessToken({
                        id: user.userid,
                        username: user.username
                    });
                    const refreshToken = generateRefreshToken({
                        id: user.userid,
                        username: user.username
                    });
                    delete user.password;
                    res.json({
                        status: 200,
                        message: 'Login successfully',
                        data: {
                            accessToken, refreshToken, user,
                        }
                    });
                }
                else {
                    next(new CustomError("Invalid username or password", 400));
                }
            }
            else {
                next(new CustomError("Invalid username or password", 400));
            }
        }
        catch(err) {
            next(new CustomError("Failed to login", 500));
        }
    }
    else {
        res.status(400).json({
            status: 400,
            message: 'Invalid data',
            description: 'username or password must not be empty',
        });
    }
}

const registerHanlder = async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let name = req.body.name;
    try {
        // data validation
        username = usernameValidate(username);
        password = passwordValidate(password);
        email = emailValidate(email);
        if(!name || name.trim().isEmpty) {
            return next(new CustomError('Name must be not empty', 400));
        } 

        const userData = await getUserByUsername(username);
        if (!userData) {
            // Database dont have this username, so we add it
            // hash password
            password = bcrypt.hashSync(password, saltRounds);

            await addNewUser({
                username, password, email, name,
            });

            const user = await getUserByUsername(username);
            const accessToken = generateAccessToken({
                id: user.userid,
                username: username
            });
            const refreshToken = generateRefreshToken({
                id: user.userid,
                username: username
            });
            
            //by default register: role is user
            const role = await getRoleByRoleId(1);

            // return a success message along with a token
            res.json({
                status: 200,
                message: 'Register successfully',
                data: {
                    accessToken, 
                    refreshToken,
                    role,
                }
            });
        } else {
            // Database has this username
            next(new CustomError('Existed username', 400));
        }
    }
    catch (err) {
        // Handle errors
        console.log(err);
        next(new CustomError(err.message, 400));
    }
}

const logoutHandler = async (req, res, next) => {
    const {accessToken, refreshToken} = req.body;
    
    if(accessToken && refreshToken) {
        // record logout token
        try {
            await addToken(accessToken);
            await addToken(refreshToken);
            req.user = null;
            res.json({
                status: 200,
                message: "logout successfully",
            });
        }
        catch(err) {
            console.log(err);
            next(new CustomError('Failed to logout', 500));
        }
    }
    else {
        res.status(400).json({
            status: 400,
            message: 'Invalid token',
        })
    }
}

const refreshTokenHandler = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    try {
        const obj = getObjectFromToken(refreshToken);
        const logoutToken = await getToken(refreshToken);
        if(logoutToken) {
            return next(new CustomError('Invalid token', 400));
        }
        const accessToken = generateAccessToken({
            id: obj.id,
            username: obj.username,
        });
        res.json({
            status: 200,
            message: 'successfully',
            data: {
                accessToken
            }
        });
    }
    catch (err) {
        next(new CustomError('Invalid token', 400));
    }
}

module.exports = {
    loginHandler, registerHanlder, logoutHandler, refreshTokenHandler,
}