app.controller('kitchenCtrl', function ($scope) {
  console.log('Подключен kitchtnCtrl');
  let socket = io.connect();

  $scope.dishInProcessQuantity = 1;

  $scope.orderedDishes = [];

  $scope.dishesInProcess = [];


  $scope.startCooking = function (dish) {
    $scope.dishesInProcess.push(dish);
    console.log($scope.dishesInProcess);
    socket.emit('change dish status',
      {
        name: dish.name,
        status: dish.status,
        newStatus: "Готовится",
        userName: dish.userName,
        visitorsEmail: dish.visitorsEmail
      }
    );
  };

  $scope.remove = function(dish){

    socket.emit('change dish status',
      {
        name: dish.name,
        status: "Готовится",
        newStatus: "Доставляется",
        userName: dish.userName,
        visitorsEmail: dish.visitorsEmail
      }
    );
    let indexInProcess = $scope.dishesInProcess.indexOf(dish)
    let indexOrdered = $scope.orderedDishes.indexOf(dish)

    $scope.dishesInProcess.splice(indexInProcess,1);
    $scope.orderedDishes.splice(indexOrdered,1);

  };
  socket.emit('Get orders', 'Запрос заказов');

  socket.on('orders', function (data) {
    console.log(data);
    $scope.$apply(function () {
      data.forEach(function (item) {
        $scope.orderedDishes.push(item);
      });
    });
  });

  // socket.on('get orders', function (menuData) {
  //   // $scope.$apply(function () {
  //   //   $scope.menu = menuData;
  //   // });
  //   console.log('Заказы получены');
  //
  //   //console.log(menuData);
  //   socket.emit('orders was received', 'Заказы получены');
  // });
});