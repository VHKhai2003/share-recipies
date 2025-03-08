const express = require('express');
const { isSuperAdmin } = require('../middleware/authorization');
const { getAllUsersHandlers, getUserProfileForAdminHandler, updateUserStatusHandler } = require('../controller');

// supper admin router for manage users
const superAdminRouter = express.Router();

superAdminRouter
    .use(isSuperAdmin)
    .get('/users', getAllUsersHandlers)
    .get('/users/:userId', getUserProfileForAdminHandler)
    .post('/users/:userId', updateUserStatusHandler); // change status

module.exports = superAdminRouter;