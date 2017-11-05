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

  file
    .read(path.join(__dirname, '../menu/menu.json'))
    .then(data => JSON.parse(data))
    .then(data => {
      socket.emit('get menu', data);

    })
    .catch(err => console.error(err));

  socket.on('menu was received', function (data) {
    console.log("Ответ от клиента: " + data);
  });

  socket.on('user', function (userData) {
    console.log('userData ---> ', userData);

    User.find({name : userData.name, email: userData.email}, (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length) {
        console.log('Исходная коллекция: ', result[0]);
        socket.emit('userData' ,{name: result[0].name, email: result[0].email, balance: result[0].balance})

      } else {

        User.create({name : userData.name, email : userData.email}, (err, result) => {
          if (err) {
            console.log('Ошибка добавления', err)
          } else {
            console.log('Пользователь добавлен', result);
            socket.emit('userData' ,{name: result.name, email: result.email, balance: result.balance})
          }
        });

      }
    });
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('new Order', function (newOrderData) {
    socket.broadcast.emit('new Order', newOrderData
    //   {
    //   name: newOrderData.dish,
    //   status: newOrderData.status,
    //   userName: newOrderData.visitorsName,
    //   visitorsEmail: newOrderData.visitorsEmail,
    //   dishPrice: newOrderData.dishPrice,
    //   number: newOrderData.number
    // }
    );
    console.log('Заказ получен', newOrderData);

    User.update({name: newOrderData.visitorsName, email: newOrderData.visitorsEmail},
      {'$set': {balance: newOrderData.balance}},
      (err, doc) => {
        if (err) {
          console.log('Ошибка редактирования', err)
        } else {
          console.log('Баланс изменен', doc);
        }
      });

    Order.create({
      visitorsEmail: newOrderData.visitorsEmail,
      visitorsName: newOrderData.visitorsName,
      dish : newOrderData.dish,
      dishPrice: newOrderData.price,
      number: newOrderData.number,
    }, (err, result) => {
      if (err) console.log('Ошибка добавления', err);
      console.log('Блюдо добавлено', result);
    });

  });

  socket.on('Get orders', function (data) {
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
            dishPrice: item.dishPrice,
            number: item.number
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

  socket.on('start preparing', function (data) {
    socket.broadcast.emit('start preparing', data);

    Order.update({
      visitorsEmail : data.visitorsEmail,
      visitorsName : data.visitorsName,
      dish : data.dish,
      status : "Заказано"
      },
      {'$set': {status: data.status}},
      (err, doc) => {
        if (err) {
          console.log('Ошибка редактирования', err)
        } else{
          console.log('Статус изменен', doc);
        }
      });

  });

  socket.on('send', function (dataDelivered) {
    socket.broadcast.emit('send', dataDelivered);
    console.log('send --->  ', dataDelivered);

    Order.update({
        visitorsEmail : dataDelivered.visitorsEmail,
        visitorsName : dataDelivered.visitorsName,
        dish : dataDelivered.dish,
        status : 'Готовится',
        dishPrice: dataDelivered.dishPrice
      },
      {'$set': {status: "Доставляется"}},
      (err, doc) => {
        if (err) {
          console.log('Ошибка редактирования', err)
        } else {
          console.log('Статус изменен', doc);

          drone
            .deliver()
            .then( () => {
              dataDelivered.status = "Подано";
              console.log('Доставлено');

              Order.update({
                  visitorsEmail : dataDelivered.visitorsEmail,
                  visitorsName : dataDelivered.visitorsName,
                  dish : dataDelivered.dish,
                  number: dataDelivered.number
                },
                {'$set': {status: "Подано"}},
                (err, doc) => {
                  if (err) {
                    console.log('Ошибка редактирования', err)
                  } else {
                    //dataDelivered.status = "Подано";
                    io.emit('delivered', dataDelivered);
                    console.log('Статус изменен на "Подано"', doc);
                  }
                });

            })
            .catch(() => {
              console.log('Возникли сложности');
              console.log(dataDelivered);

              Order.update({
                  visitorsEmail : dataDelivered.visitorsEmail,
                  visitorsName : dataDelivered.visitorsName,
                  dish : dataDelivered.dish,
                  number: dataDelivered.number
                }, {'$set': {status: "Возникли сложности"}},
                (err, doc) => {
                  if (err) {
                    console.log('Ошибка редактирования', err)
                  } else {

                    dataDelivered.status = "Возникли сложности";
                    io.emit('error', dataDelivered);

                    User.update({name: dataDelivered.visitorsName, email: dataDelivered.visitorsEmail},
                      {'$inc': {balance: dataDelivered.dishPrice}},
                      (err, doc) => {
                        if (err) {
                          console.log('Ошибка возвращения на денег', err)
                        } else {

                          console.log('Деньги возвращены на счет пользователя', doc);

                          User.findOne({name: dataDelivered.visitorsName, email: dataDelivered.visitorsEmail},
                            function (err, resultBalance) {
                              if (err) {
                                console.log('Ошибка поиска пользователя', err);
                              } else {
                                console.log('Result.balance: ->  ', resultBalance.balance);
                                io.emit('update user fee', {balance: +resultBalance.balance});
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

