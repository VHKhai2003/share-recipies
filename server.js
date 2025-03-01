require('dotenv').config();
const express = require('express');
const { authRouter } = require('./src/router');


const app = express();
app.use(express.json());

// using router
app.use('/auth', authRouter);

// global exception handler
require('./src/middleware/error-handler')(app);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});