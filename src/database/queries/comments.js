const postgres = require('../config');

//get total comment in level 1, don't care about reply comments
const getTotalComments = async(recipeId) => {
    const queryString = `select count(*) as total
                        from comments
                        where recipeid = $1 and replyTo is null`;
    const values = [recipeId];
    const data = await postgres.query(queryString, values);
    if(data.rowCount > 0) {
        return data.rows[0].total;
    }
    else {
        return 0;
    }
}

//get reply comments
const getReplyComments = async (commentId) => {
    const queryString = `select commentId, recipeId ,users.Name, content, datesubmit, 
                                users.UserId as userId, avatar, replyto
                        from comments join users on comments.UserId = users.UserId 
                        where replyto = $1
                        order by datesubmit asc`;
    const value = [commentId];
    const data = await postgres.query(queryString, value);
    const result = [];
    if(data.rowCount > 0) {
        const rows = data.rows;
        rows.forEach((item)=>{
            result.push({
                commentId: item.commentid,
                recipeId: item.recipeid,
                userId: item.userid,
                userName: item.name,
                avatar: item.avatar,
                content: item.content,
                dateSubmit: item.datesubmit,
                replyTo: item.replyto
            })
        })
    }

    return result;
}


//get comment by recipe's id
const getComments = async (recipeId, page = 1, perPage = 10, sortBy = 'newest') => {
    const order = sortBy === 'oldest' ? 'asc' : 'desc';
    let queryString = `select commentId, recipeId ,users.Name, content, datesubmit, users.UserId as userId, avatar
                        from comments join users on comments.UserId = users.UserId
                        where recipeid = $1 and replyTo is null
                        order by datesubmit ${order}
                        offset $2
                        limit $3`;

    const offset = (page-1)*perPage;
    const limit = perPage;
    const values = [recipeId ,offset, limit];
    const total = Number(await getTotalComments(recipeId));
    //result return to client
    let result = {
        data: [],
        metadata: {
            total, page, perPage, sortBy,
        }
    }
    //no comment in this recipe
    if(total == 0){
        return result;
    }

    const data = await postgres.query(queryString, values);
    if(data.rowCount > 0) {
        const rows = data.rows;
        // console.log(rows);
        
        for(item of rows) {
            //get reply comments
            const subComments = await getReplyComments(item.commentid);
            // console.log(subComments);

            result.data.push({
                commentId: item.commentid,
                recipeId: item.recipeid,
                userId: item.userid,
                userName: item.name,
                avatar: item.avatar,
                content: item.content,
                dateSubmit: item.datesubmit,
                replyComments: subComments
            })
        }
        // console.log(result)
        return result;
    }
    else{
        //no comment in this page, perPage
        return result;
    }
}


//add comment
const addComment = async (recipeId, userId, content = '', replyTo = null) => {
    const queryString = `insert into comments(recipeid, userid, content, replyto)
                        values($1, $2, $3, $4) returning *`;
    const values = [recipeId, userId, content, replyTo];

    const result = await postgres.query(queryString, values);
    return result.rowCount > 0 ? result.rows[0] : null;
}

//remove comment
const removeComment = async (commentId, userId) => {
    const queryString = `delete from comments where commentid = $1 and userid = $2`;
    const values = [commentId, userId];

    try {
        await postgres.query(queryString, values);
    }
    catch(err) {
        //delete reply comment
        await postgres.query(`delete from comments where replyto = $1`, [commentId]);
        await postgres.query(queryString, values);
    }
}

//update a comment with new content
const updateComment = async (commentId, userId ,newContent) => {
    //get date
    let date = new Date();
    date = date.toLocaleDateString();

    const queryString = `update comments 
                        set content = $1, datesubmit = $2
                        where commentid = $3 and userid = $4 returning *`;
    const values = [newContent, date, commentId, userId];
    const result = await postgres.query(queryString, values);

    return result.rowCount > 0 ? result.rows[0] : null;
}


module.exports = {
    getComments, addComment, removeComment, updateComment
}