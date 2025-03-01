const CustomError = require("./custom-error");

const errorHandler = (app) => {
    
    // path not found
    app.use((req, res, next) => {
        res.status(404).json({
            status: 404,
            message: 'Path not found!',
            description: 'The path you access is not existed!',
        });
    });

    // global exception handler
    app.use((err, req, res, next) => {
        let statusCode = err.statusCode || 500;
        // if (err instanceof CustomError) {
        //     statusCode = err.statusCode;
        // }

        res.status(statusCode).json({
            status: statusCode,
            message: err.message,
        });
    });
}

module.exports = errorHandler;