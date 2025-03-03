const { loginHandler, registerHanlder, logoutHandler, refreshTokenHandler } = require('./auth.c');
const { updateUserInfoHandler, getUserInfoHandler } = require('./user.c');

module.exports = {
    loginHandler, registerHanlder, logoutHandler, refreshTokenHandler,
    updateUserInfoHandler, getUserInfoHandler,
}