app.controller('kitchenCtrl', function ($scope) {
  console.log('Подключен kitchtnCtrl');

  $scope.dishInProcessQuantity = 1;

  $scope.orderedDishes = [
    {
      name: "Макароны по-флотски",
      number: 0,
      status: "Заказано",
    },
    {
      name: "Картофель в мундирах",
      number: 1,
      status: "Заказано"
    },
    {
      name: "Сосиски молочные",
      number: 2,
      status: "Заказано"
    },
    {
      name: "Борщ",
      number: 3,
      status: "Заказано"
    },
    {
      name: "Суп с фрикадельками",
      number: 4,
      status: "Заказано"

    }
  ];

  $scope.dishesInProcess = [];


  $scope.startCooking = function (dish) {
    $scope.dishesInProcess.push(dish);
    console.log($scope.dishesInProcess);
  };

  $scope.remove = function(dish){
    let indexInProcess = $scope.dishesInProcess.indexOf(dish)
    let indexOrdered = $scope.orderedDishes.indexOf(dish)

    $scope.dishesInProcess.splice(indexInProcess,1);
    $scope.orderedDishes.splice(indexOrdered,1);

  }


});