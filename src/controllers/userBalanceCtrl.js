app.controller('userBalanceCtrl', function ($scope, loginFactory) {
  console.log('Подключен userBalanceCtrl');

  $scope.factory = loginFactory;

  $scope.getMoney = function () {
    console.log('Добавлено 100 кредитов');
    $scope.factory.balance += 100;
  };

  $scope.dishQuantity = 1;

  $scope.orderValue = null;



  $scope.putDishToOrder = function (dish) {
    console.log('Блюдо' + dish + 'добавлено к заказу');
    $scope.order.push({
      number: $scope.dishQuantity,
      name: dish.name,
      price: dish.price
    });
    console.log($scope.order);
    $scope.dishQuantity += 1;
    $scope.orderValue += dish.price;
    $scope.factory.balance -= dish.price;
  };

  $scope.isEnough = function (dish) {
    if($scope.factory.balance >= dish.price) {
      return true
    } else {
      return false
    }

  };

  $scope.menu = [
    {
      name: "Макароны по-флотски",
      price: 100
    },
    {
      name: "Картофель в мундирах",
      price: 150
    },
    {
      name: "Сосиски молочные",
      price: 200
    },
    {
      name: "Борщщ",
      price: 300
    },
    {
      name: "Суп с фрикадельками",
      price: 50
    }
  ];

  $scope.order = [
  ]

});