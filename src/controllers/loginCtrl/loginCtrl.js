app.controller('loginCtrl', function ($scope, $http, loginFactory) {
  console.log('Подключен loginCtrl');

  $scope.user = {};

  $scope.factory = loginFactory;

  //$scope.userName ='';

  // let postAnswer = function ($http) {
  //   return $http({
  //     method: 'POST',
  //     url: 'http://localhost:4000/api/v1/user',
  //     data:  $scope.user
  //   });
  // };

  $scope.setUser = function () {
    console.log($scope.user);

    return $http({method: 'POST', url: 'http://localhost:4000/api/v1/user', data:  $scope.user})
      .then(function (data) {
        console.log(data.data.name);
        $scope.factory.userName = data.data.name;
        $scope.factory.balance = data.data.balance;

      })
      .then(function (e) {console.log(e)})

  };

});