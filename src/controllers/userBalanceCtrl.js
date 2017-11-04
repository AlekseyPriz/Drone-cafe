app.controller('userBalanceCtrl', function ($scope, loginFactory) {
  console.log('Подключен userBalanceCtrl');
  let socket = io.connect();

  $scope.factory = loginFactory;

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
    console.log('Блюдо "' + dish.name + '" добавлено к заказу');
    $scope.order.push({
      number: $scope.dishQuantity,
      name: dish.name,
      price: +dish.price
    });
    console.log($scope.order);
    $scope.dishQuantity += 1;
    $scope.orderValue += +dish.price;
    //console.log('orderValue: ' +  $scope.orderValue);
    $scope.factory.balance -= +dish.price;
  };

  $scope.isEnough = function (dishPrice) {
    if ($scope.factory.balance >= dishPrice) {
      return true
    } else {
      return false
    }

  };

  $scope.createOrder = function () {
    console.log('Заказ отправлен на сервер ', $scope.order);
    socket.emit('new Order', {
      userName: $scope.factory.userName,
      userEmail: $scope.factory.email,
      order: $scope.order,
      userBalance: $scope.factory.balance
    });
    $scope.order = [];
    $scope.dishQuantity = 1;
    $scope.orderValue = null;

  };

  //var socket = io.connect();
  socket.on('get menu', function (menuData) {
    $scope.$apply(function () {
      $scope.menu = menuData;
    });
    console.log(menuData);
    socket.emit('menu was received', 'Меню получено');
  });

  $scope.order = [
  ];

});