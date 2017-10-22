const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Настройка Монгуза
//
//mongodb://dronecafeuser:drone308938731@ds127065.mlab.com:27065/dronecafe
  const dbURI = 'mongodb://127.0.0.1:27017/droneCafe';

  if (process.env.NODE_ENV === 'production') {
    //noinspection JSAnnotator
    mongoose.connect(process.env.MONGOLAB_URI, { useMongoClient: true });
    //dbURI = process.env.MONGOLAB_URI;
  }
//mongoose.connect(dbURI, { useMongoClient: true });

mongoose.connection.on('error', (err) => {
  console.log('Ошибка подключения Монгуза' + err);
});
mongoose.connection.on('open', () => {
  console.log('Подключение к монго произошло успешно!'  + dbURI);
});
mongoose.connection.on('disconnected', () => {
  console.log('Монгуз отключен');
});

const Schema = mongoose.Schema;

// схема для Пользователей
const userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, index: { unique: true }},
  balance: {type: Number,  default: 100}
});

const  User = mongoose.model('User', userSchema);

// User.create({name : "Федор", email: "f@f.com"}, (err, result) => {
//   if (err) {
//     console.log('Ошибка добавления', err)
//   } else{
//     console.log('Пользователь добавлен', result);
//     //res.json(result);
//   }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

//добавление пользователя
app.post('/api/v1/user', function(req, res) {
  if (!req.body.name || !req.body.email) {
    res.status(400);
    res.send({ error: 'Данные указаны не полностью' });
  }

  User.find({email: req.body.email}, (err, result) => {
    if (err) {
      console.log(err);
    } else if (result.length) {
      console.log('Исходная коллекция: ', result);
      res.json(result);
    } else {

      User.create({name : req.body.name, email : req.body.email}, (err, result) => {
        if (err) {
          console.log('Ошибка добавления', err)
        } else{
          console.log('Пользователь добавлен', result);
          res.json(result);
        }
      });

    }
  });


});

app.all('/*', function(req, res) {
 // console.log("Сервер перенаправлен на ангулар роутер");
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
