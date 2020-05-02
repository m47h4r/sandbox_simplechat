const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

require('./models/User');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/user', usersRouter);

module.exports = app;
