app.controller('userBalanceCtrl', function ($scope, loginFactory) {
  console.log('Подключен userBalanceCtrl');

  $scope.factory = loginFactory;

  $scope.getMoney = function () {
    console.log('Добавлено 100 кредитов');
    $scope.factory.balance += 100;
  };


});