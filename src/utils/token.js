const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.SECRET_KEY

const generateAccessToken = (obj) => {
    try {
        //create token has 2 hours expires
        const newToken = jwt.sign(obj, secretKey, {expiresIn: 7200});
        return newToken;
    }
    catch (err) {
        throw new Error('Can not create token');
    }
}

const generateRefreshToken = (obj) => {
    try {
        //create token has 1 year expires
        const newToken = jwt.sign(obj, secretKey, {expiresIn: 31536000});
        return newToken;
    }
    catch (err) {
        throw new Error('Can not create token');
    }
}

const getObjectFromToken = (token) => {
    try {
        const obj = jwt.verify(token, secretKey);
        return obj;
    }
    catch (err) {
        throw new Error('Invalid Credentials');
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    getObjectFromToken
}
