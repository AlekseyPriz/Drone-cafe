const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const file = require('./menu/file-promise');
const User = require('./models/userModel');



const app = express();

// uncomment after placing your favicon in /public

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/src', express.static(path.join(__dirname, '/src')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/kitchen', function(req, res) {
  res.sendFile(path.join(__dirname + '/kitchenInterface.html'));
});

app.all('/*', function(req, res) {
  res.sendfile(path.join(__dirname + '/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
