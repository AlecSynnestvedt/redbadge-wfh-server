require('dotenv').config();

// imports
const express = require('express');
const dbConnection = require('./db');
const controllers  = require('./controllers');
const middleware = require('./middleware');

// instantiation
const app = express();

// middleware
app.use(middleware.CORS);
app.use(express.json());

// endpoints
app.use('/auth', controllers.userscontroller);
app.use(middleware.validateSession);
app.use('/posts', controllers.postscontroller);
app.use('/comments', controllers.commentscontroller);

// database auth & sync
try {
    dbConnection
        .authenticate()
        .then(async () => await dbConnection.sync(
                {force: true}
            )) 
        .then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`[SERVER]: App is listening on ${process.env.PORT}`);
            });
        });
} catch (err) {
    console.log('[SERVER]: Server crashed');
    console.log(err);
}