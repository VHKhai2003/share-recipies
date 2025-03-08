const pool = require('../config');

const getUserByUsername = async (username) => {
    const result = await pool.query(
        'Select* from users where username = $1', 
        [username]
    );
    return result.rowCount > 0 ? result.rows[0] : null;
}

const getUserById = async (id) => {
    const result = await pool.query(
        'Select* from users where userid = $1', 
        [id]
    );
    return result.rowCount > 0 ? result.rows[0] : null;
}

// add new user for register function
const addNewUser = async (user) => {
    const queryString = 'insert into Users(username, password, name, email, role) values($1, $2, $3, $4, $5)';
    const values = [user.username, user.password, user.name, user.email, 1];
    await pool.query(queryString, values);
}

const updateUserInfo = async (user) => {
    const queryString = 'update Users set email = $1, name = $2, avatar = $3 where userid = $4 returning *';
    const values = [user.email, user.name, user.avatar, user.userid];
    const result = await pool.query(queryString, values);
    return result.rowCount > 0 ? result.rows[0] : null;
}


const getAllUsers = async () => {
    let queryString = 'select users.*, roles.name as roleName from users left join roles on users.role = roles.roleid where users.role != 3';
    const usersQueryData = await pool.query(queryString);
    const usersData = usersQueryData.rows;
    const users = usersData.map((item) => {
        const roleName = item.roleName;
        delete item.roleName;
        delete item.password;
        item.role = roleName;
        return item;
    })
    return users;
}


const updateUserStatus = async (userId, newStatus) => {
    const queryString = 'update users set status = $1 where userId = $2 returning *';
    const values = [newStatus, userId];
    const result = await pool.query(queryString, values);
    return result.rowCount > 0 ? result.rows[0] : null;
}

const updateUserRole = async (userId, newRole) => {
    const queryString = 'update users set role = $1 where userId = $2 returning *';
    const values = [newRole, userId]
    const result = await pool.query(queryString, values);
    return result.rowCount > 0 ? result.rows[0] : null;
}


module.exports = {
    getUserByUsername, getUserById, addNewUser, updateUserInfo, getAllUsers, updateUserStatus, updateUserRole,
}