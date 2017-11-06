app.controller('userBalanceCtrl', function ($scope, loginFactory) {
  console.log('Подключен userBalanceCtrl');
  let socket = io.connect();

  $scope.factory = loginFactory;
  $scope.order = [];

  $scope.getMoney = function () {
    console.log('Добавлено 100 кредитов');
    $scope.factory.balance += 100;
  };

  socket.on('update user fee', function (feeData) {
    console.log('feeData', feeData);
    $scope.$apply(function () {
      $scope.factory.balance = feeData.balance;
    });
  });

  $scope.dishQuantity = 1;

  $scope.orderValue = null;

  $scope.putDishToOrder = function (dish) {
    console.log('Блюдо --->"' , dish );

    console.log('Блюдо "' + dish.name + '" добавлено к заказу');
    $scope.order.push({
      number: $scope.dishQuantity,
      name: dish.name,
      price: +dish.price,
      status: "Выбрано"
    });
    console.log($scope.order);
    $scope.dishQuantity += 1;
  };

  $scope.isEnough = function (dishPrice) {
    if($scope.factory.balance >= dishPrice) return true;
    return false
  };

  $scope.createOneOrder = function (dish) {

    $scope.factory.balance -= dish.price;
    $scope.orderValue += +dish.price;
    dish.status = "Заказано";

    let oneOrder = {
      visitorsName: $scope.factory.userName,
      visitorsEmail: $scope.factory.email,
      dish: dish.name,
      dishPrice: dish.price,
      number: dish.number,
      balance: $scope.factory.balance
    };

    console.log('Заказ одного блюда отправлен на сервер ', oneOrder);


    socket.emit('new Order', oneOrder);
  };

  socket.on('get menu', function (menuData) {
    $scope.$apply(function () {
      $scope.menu = menuData;
    });
    console.log(menuData);
    socket.emit('menu was received', 'Меню получено');
  });

  socket.on('start preparing', function(dishdata) {
    $scope.$apply(function () {
      let position = dishdata.number - 1;
      $scope.order[position].status = dishdata.status;
    });
  });

  socket.on('send', function(dishdata) {
    $scope.$apply(function () {
      $scope.order[dishdata.number - 1].status = dishdata.status;
    });
  });

  socket.on('delivered', function(dishdata) {
    $scope.$apply(function () {
      $scope.order[dishdata.number - 1].status = dishdata.status;
    });
  });

  socket.on('error', function(dishdata) {
    $scope.$apply(function () {
      $scope.order[dishdata.number - 1].status = dishdata.status;
    });
  });



});