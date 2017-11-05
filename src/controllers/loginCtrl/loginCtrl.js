app.controller('loginCtrl', function ($scope, $http, loginFactory) {
  console.log('Подключен loginCtrl');
  let socket = io.connect();

  $scope.user = {};

  $scope.factory = loginFactory;

  $scope.setUser = function () {
    socket.emit('user', $scope.user);
    socket.on('userData', function (userData) {
      console.log('User ---> ', userData);
      $scope.$apply(function () {
        $scope.factory.userName = userData.name;
        $scope.factory.email = userData.email;
        $scope.factory.balance = userData.balance;
        console.log($scope.factory);
      });
    });
  };
});

