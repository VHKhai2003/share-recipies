require('dotenv').config();
const express = require('express');
const { authRouter, userRouter } = require('./router');
const { tokenFilter, isAuthenticated } = require('./middleware/authentication');
const { isAdmin, isSuperAdmin } = require('./middleware/authorization');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(tokenFilter);

// using router
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.get("/token-filter", (req, res) => {
    res.json(req.user);
})

app.get("/authenticated", isAuthenticated, (req, res) => {
    res.json(req.user);
})

app.get("/is-admin", isAdmin, (req, res) => {
    res.json(req.user);
})

app.get("/is-super-admin", isSuperAdmin, (req, res) => {
    res.json(req.user);
})

// global exception handler
require('./middleware/error-handler')(app);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});