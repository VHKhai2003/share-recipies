const pool = require('../config');

const getUserByUsername = async (username) => {
    const result = await pool.query(
        'Select* from users where username = $1', 
        [username]
    );
    if(result.rowCount > 0) {
        return result.rows[0];
    }
    return null;
}

const getUserById = async (id) => {
    const result = await pool.query(
        'Select* from users where userid = $1', 
        [id]
    );
    if(result.rowCount > 0) {
        return result.rows[0];
    }
    return null;
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

module.exports = {
    getUserByUsername, getUserById, addNewUser, updateUserInfo,
}