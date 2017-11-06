let chai = require('chai');
let server = require('../bin/www.js');
let should = chai.should();
const file = require('../menu/file-promise');
const path = require('path');
const expect = require('chai').expect;

var io = require('socket.io-client');



describe('Тест меню', () => {

  it('Меню через socket.io соответствует меню из файла menu.json', function (done) {
    let client = io.connect('http://localhost:4000/');
      client.on('get menu', function (socketData) {
        file
          .read(path.join(__dirname, '../menu/menu.json'))
          .then(fileData => JSON.parse(fileData))
          .then(fileData => {
            expect(fileData, 'меню не совпадают').to.eql(socketData);
            done();
          })
          .catch(err => console.error(err));
      });
  });

  it('Должен зарегистрировать пользователя', (done) => {
    let client = io.connect('http://localhost:4000/');
    let testUserREQ = {name: "testUser", email: "test@test.com"};
    let testUserRES = {name: "testUser", email: "test@test.com", balance: 100};
    client.emit('user', testUserREQ);
    client.on('userData', function (testUserData) {
      expect(testUserData, 'Пользователь создан').to.eql(testUserRES);
      done();
    });
  });

  it('Должен добавить заказ', (done) => {
    let client = io.connect('http://localhost:4000/');

    let testOrder = {
      visitorsName: "testUser",
      visitorsEmail: "test@test.com",
      dish: "Блюдо",
      dishPrice: 555,
      number: 55,
      balance: 100
    };

    client.emit('new Order', testOrder);
    client.emit('Get orders', 'Запрос заказов');
    client.on('orders', function (dataArr) {
      let checkDataArr = function (dataArr) {
        if (dataArr.some(testOrder)) {
          return true
        }
      };
      expect(checkDataArr(dataArr), 'Содержит testOrder').to.be(true);
      done();
    });
  });

  it('Блюдо доставлено', (done) => {
    let client = io.connect('http://localhost:4000/');

    let testDishPreparing = {
      visitorsEmail: "test@test.com",
      visitorsName: "testUser",
      dish: "Блюдо",
      dishPrice: 555,
      number: 55,
      status: "Готовится"
    };


    client.emit('start preparing', testDishPreparing);

    let testDishDelivering = {
      visitorsEmail: "test@test.com",
      visitorsName: "testUser",
      dish: "Блюдо",
      dishPrice: 555,
      number: 55,
      status: "Доставляется"
    };

    client.emit('send', testDishDelivering);

    client.on('delivered', function (deliveredData) {
      setTimeout(() => {
        expect(deliveredData, 'Содержит testOrder').to.equal('array');
        done();
      }, 20000);
    });
    client.on('error', function (deliveredData) {
      setTimeout(() => {
        expect(deliveredData, 'Содержит testOrder').to.equal('array');
        done();
      }, 20000);
    });
  });

});



