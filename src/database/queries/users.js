const pool = require('../config');

const getUserByUsername = async (username) => {
    const result = await pool.query('Select* from users where username = $1', [username]);
    if(result.rowCount == 1) {
        return result.rows[0];
    }
    return null;
}

//add new user for register function
const addNewUser = async (user) => {
    const queryString = 'insert into Users(username, password, name, email, role) values($1, $2, $3, $4, $5)';
    const values = [user.username, user.password, user.name, user.email, 1];
    await pool.query(queryString, values);
}


module.exports = {
    getUserByUsername, addNewUser
}