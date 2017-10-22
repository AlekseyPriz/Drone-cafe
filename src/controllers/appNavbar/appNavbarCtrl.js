app.controller('appNavbarCtrl', function ($scope, loginFactory) {
  console.log('Подключен appNavbarCtrl');

  $scope.factory = loginFactory.userName;

});