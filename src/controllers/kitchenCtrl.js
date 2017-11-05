app.controller('kitchenCtrl', function ($scope) {
  console.log('Подключен kitchtnCtrl');
  let socket = io.connect();

  $scope.dishInProcessQuantity = 1;

  $scope.orderedDishes = [];

  $scope.dishesInProcess = [];


  $scope.startCooking = function (dish) {
    dish.status = "Готовится";

      $scope.dishesInProcess.push(dish);
      socket.emit('start preparing', dish);
  };

  $scope.remove = function(dish){
    dish.status = "Доставляется";

    console.log('dish remove ---> ', dish);

    socket.emit('send',
      dish
      // {
      //   name: dish.dish,
      //   status: "Готовится",
      //   newStatus: "Доставляется",
      //   userName: dish.userName,
      //   visitorsEmail: dish.visitorsEmail,
      //   dishPrice: dish.dishPrice,
      //   number: dish.number
      // }
    );
    let indexInProcess = $scope.dishesInProcess.indexOf(dish);
    let indexOrdered = $scope.orderedDishes.indexOf(dish);

    $scope.dishesInProcess.splice(indexInProcess,1);
    $scope.orderedDishes.splice(indexOrdered,1);

  };
  socket.emit('Get orders', 'Запрос заказов');

  socket.on('new Order', function (data) {
    $scope.$apply(function () {
        $scope.orderedDishes.push(data);
    });
  });

  socket.on('orders', function (data) {
    console.log(data);
    $scope.$apply(function () {
      data.forEach(function (item) {
        $scope.orderedDishes.push(item);
      });
    });
  });

  socket.on('dishesInProcess', function (data) {
    console.log(data);
    $scope.$apply(function () {
      data.forEach(function (item) {
        $scope.dishesInProcess.push(item);
      });
    });
  });

});