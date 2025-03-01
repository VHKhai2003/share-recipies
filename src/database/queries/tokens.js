// the tokens table is used to store the token of logout user

const postgres = require('../config');

const getToken = async (token) => {
    const queryString = 'select * from TOKENS where tokenvalue = $1'
    const values = [token]
    try {
        // delete token out of date
        // await clearTOKENS();

        // query to get token
        const tokenQueryData = await postgres.query(queryString, values);
        const tokenData = tokenQueryData.rowCount >= 1 ? tokenQueryData.rows[0] : null;
        return tokenData;
    }
    catch (err) {
        throw new Error('Internal Server Error')
    }
}


//add token to table TOKENS
const addToken = async (token) => {
    const queryString = 'insert into TOKENS(TokenValue) values($1)'
    const values = [token]
    try {
        await postgres.query(queryString, values)
    }
    catch (err) {
        throw new Error('Internal Server Error')
    }
}


//delete a token
const deleteToken = async(token) => {
    const queryString = 'delete from TOKENS where tokenvalue = $1'
    const values = [token]
    try {
        await postgres.query(queryString, values)
    }
    catch (err) {
        throw new Error('Internal Server Error')
    }
}


//clear records in TOKENS table
const clearTOKENS = async() => {
    //delete after 2 hours
    const queryString = `delete from tokens
                        where (current_timestamp > (created_time + '2 hours'));`

    try {
        await postgres.query(queryString);
    }
    catch(err) {
        throw new Error('Internal Server Error');
    }
}

module.exports = {
    getToken, addToken, deleteToken
}