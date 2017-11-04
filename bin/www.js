#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('drone-cafe:server');
const http = require('http');
const file = require('../menu/file-promise');
const path = require('path');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const drone = require('netology-fake-drone-api');


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

  //socket.emit('update user fee', );
  socket.emit('update user fee', {balance: 55555555});


  file
    .read(path.join(__dirname, '../menu/menu.json'))
    .then(data => JSON.parse(data))
    .then(data => {
      //console.log(data);
      socket.emit('get menu', data);

    })
    .catch(err => console.error(err));

  socket.on('menu was received', function (data) {
    console.log("Ответ от клиента: " + data);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('new Order', function (newOrderData) {
    console.log('Заказ получен', newOrderData);

    User.update({
        name: newOrderData.userName,
        email: newOrderData.userEmail
      },
      {'$set': {balance: newOrderData.userBalance}},
      (err, doc) => {
        if (err) {
          console.log('Ошибка редактирования', err)
        } else{
          console.log('Баланс изменен', doc);
        }
      });

    newOrderData.order.forEach(function (item) {

      Order.create({
        visitorsEmail: newOrderData.userEmail,
        visitorsName: newOrderData.userName,
        dish : item.name,
        dishPrice: item.price
      }, (err, result) => {
        if (err) {
          console.log('Ошибка добавления', err)
        } else{
          console.log('Блюдо добавлено', result);
        }
      });

    });
  });

  socket.on('Get orders', function (data) {
    //console.log('user disconnected');
    console.log(data);

    Order.find({status: "Заказано"}, function(err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        console.log('Исходная коллекция: ', result);
        let resResult = [];
        result.forEach(function (item) {
          resResult.push({
            name: item.dish,
            status: item.status,
            userName: item.visitorsName,
            visitorsEmail: item.visitorsEmail,
            dishPrice: item.dishPrice
          })
        });
        socket.emit('orders', resResult)
      }
    });

    Order.find({status: "Готовится"}, function(err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        console.log('Исходная коллекция: ', result);
        let resResult = [];
        result.forEach(function (item) {
          resResult.push({
            name: item.dish,
            status: item.status,
            userName: item.visitorsName,
            visitorsEmail: item.visitorsEmail,
          })
        });
        socket.emit('dishesInProcess', resResult);
      }
    });

  });

  socket.on('set dish preparing status', function (data) {
    console.log('set dish preparing status   ', data);

    Order.update({
      visitorsEmail : data.visitorsEmail,
      visitorsName : data.userName,
      dish : data.name,
      status : data.status
      },
      {'$set': {status: data.newStatus}},
      (err, doc) => {
        if (err) {
          console.log('Ошибка редактирования', err)
        } else{
          console.log('Статус изменен', doc);
        }
      });

  });

  socket.on('set dish delivered status', function (data) {
    socket.emit('update user fee', {balance: 10000000});

    console.log('set dish delivered status   ', data);



    Order.update({
        visitorsEmail : data.visitorsEmail,
        visitorsName : data.userName,
        dish : data.name,
        status : data.status,
        dishPrice: data.dishPrice
      },
      {'$set': {status: data.newStatus}},
      (err, doc) => {
        if (err) {
          console.log('Ошибка редактирования', err)
        } else {
          console.log('Статус изменен', doc);

          drone
            .deliver()
            .then( () => {
              console.log('Доставлено');

              Order.update({
                  visitorsEmail : data.visitorsEmail,
                  visitorsName : data.userName,
                  dish : data.name,
                  status : "Доставляется"
                },
                {'$set': {status: "Подано"}},
                (err, doc) => {
                  if (err) {
                    console.log('Ошибка редактирования', err)
                  } else {
                    console.log('Статус изменен на "Подано"', doc);
                  }
                });

            })
            .catch(() => {
              console.log('Возникли сложности');
              console.log(data);

              Order.update({
                  visitorsEmail : data.visitorsEmail,
                  visitorsName : data.userName,
                  dish : data.name,
                  status : "Доставляется"
                },
                {'$set': {status: "Возникли сложности"}},
                (err, doc) => {
                  if (err) {
                    console.log('Ошибка редактирования', err)
                  } else {

                    User.update({name: data.userName, email: data.visitorsEmail},
                      {'$inc': {balance: data.dishPrice}},
                      (err, doc) => {
                        if (err) {
                          console.log('Ошибка возвращения на денег', err)
                        } else {
                          console.log('Деньги возвращены на счет пользователя', doc);
                          User.findOne({name: data.userName, email: data.visitorsEmail},
                            function (err, result) {
                              if (err) {
                                console.log('Ошибка поиска пользователя', err)
                              } else {
                                console.log('Result.balance: ->  ', result.balance);
                                socket.emit('update user fee', {balance: +result.balance});
                              }
                            })
                        }
                      });


                    console.log('Статус изменен на "Возникли сложности"', doc);
                  }
                });
            });
        }
      });
  });
});

