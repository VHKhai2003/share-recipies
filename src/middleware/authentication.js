const { getObjectFromToken } = require('../utils/token');
const { getToken, getUserById } = require('../database/queries');
const CustomError = require('./custom-error');

const tokenFilter = async (req, res, next) => {
    const token = req.headers.authorization;
    if (token) { 
        try {
            const obj = getObjectFromToken(token);
            const logoutToken = await getToken(token);
            if(!logoutToken) {
                const userData = await getUserById(obj.id);
                if(userData && userData.status === 'Active') {
                    req.user = userData;
                }
            }  
        }
        catch (err) {
            console.log(err);
        }
    }
    next();
}

const isAuthenticated = async (req, res, next) => {
    req.user ? next() : next(new CustomError('Unauthoried', 401));
}


module.exports = {
    tokenFilter, isAuthenticated,
}