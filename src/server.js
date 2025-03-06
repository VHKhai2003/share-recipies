require('dotenv').config();
const express = require('express');
const { authRouter, userRouter, recipeRouter, userActionRouter, adminRouter } = require('./router');
const { tokenFilter } = require('./middleware/authentication');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(tokenFilter);

// using router
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/recipe', recipeRouter);
app.use('/action', userActionRouter);

app.use('/admin', adminRouter);


// global exception handler
require('./middleware/error-handler')(app);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});