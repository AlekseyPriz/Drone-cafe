console.log('Приложение подключено');

let app = angular.module('droneCafe', []);

app.controller('appController', function ($scope) {
  $scope.name = 'petr';
});

