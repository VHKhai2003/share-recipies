const pool = require('../config')

const getRoleByRoleId = async (roleId) => {
    const queryString = 'select name from roles where roleid = $1';
    const values = [roleId];
    const roleQueryData = await pool.query(queryString, values);
    const roleName = roleQueryData.rowCount > 0 ? roleQueryData.rows[0].name : null;
    return roleName;
}


const getAllRoles = async () => {
    const queryString = 'select * from roles'
    const roleQueryData = await pool.query(queryString)
    return roleQueryData.rows;
}

module.exports = {
    getRoleByRoleId,
    getAllRoles
}