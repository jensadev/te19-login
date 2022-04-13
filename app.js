require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nunjucks = require('nunjucks');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./utils/database');
const sessionStore = new MySQLStore({ createDatabaseTable: true }, pool.promise());

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api/index') ;

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { sameSite: true }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
