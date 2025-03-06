const CustomError = require("./custom-error");

const isAdmin = (req, res, next) => {
    if(req.user?.role === 2 || req.user?.role === 3) {
        return next();
    }
    next(new CustomError('Forbidden', 403));
}

const isSuperAdmin = (req, res, next) => {
    if(req.user?.role === 3) {
        return next();
    }
    next(new CustomError('Forbidden', 403));
}

module.exports = {
    isAdmin, isSuperAdmin,
}