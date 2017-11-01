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

    return $http({method: 'POST', url:
    //'http://localhost:4000/api/v1/user'
    'https://guarded-thicket-38576.herokuapp.com/api/v1/user'
      , data:  $scope.user})
      .then(function (userData) {
        console.log(userData);

        console.log('userData.data.name - '+ userData.data.name);
        $scope.factory.userName = userData.data.name;
        $scope.factory.balance = +userData.data.balance;
        console.log($scope.factory);
      })
      .then(function (e) {
        if (e) console.log(e);
      })

  };

});