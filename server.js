require('dotenv').config();
const express = require('express');
const { authRouter } = require('./src/router');
const { tokenFilter, isAuthenticated } = require('./src/middleware/authentication');
const { isAdmin, isSuperAdmin } = require('./src/middleware/authorization');


const app = express();
app.use(express.json());
app.use(tokenFilter);

// using router
app.use('/auth', authRouter);

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
require('./src/middleware/error-handler')(app);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});