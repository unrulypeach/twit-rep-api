const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
const app = express();
const corsOptions = { 
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: ['http://localhost:8000', 'http://localhost:5173', 'https://twitter-replica-orpin.vercel.app', 'https://twit-rep-api.onrender.com', 'https://twitter-replica-qv5mmm3dz-ls-projects-6ac02d07.vercel.app' ]
};
app.use(cors(corsOptions)); 

app.use(passport.initialize());

require('dotenv').config();
require('./config/database');
require('./models/auth');
require('./config/passport')(passport);


const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
