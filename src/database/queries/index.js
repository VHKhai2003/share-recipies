const { getUserByUsername, addNewUser } = require('./users');
const { getRoleByRoleId, getAllRoles } = require('./roles');


module.exports = {
    getUserByUsername, addNewUser,
    getRoleByRoleId, getAllRoles,
}