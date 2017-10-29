app.controller('kitchenCtrl', function ($scope) {
  console.log('Подключен kitchtnCtrl');

  $scope.dishInProcessQuantity = 1;

  $scope.orderedDishes = [
    {
      name: "Макароны по-флотски",
      number: 0,
      status: "Заказано",
      ordered: true
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
  }


});