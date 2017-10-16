console.log('Приложение подключено');

let app = angular.module('droneCafe', ['ui.router', 'ngRoute']);


app.config([ '$stateProvider', '$locationProvider',   function($stateProvider, $locationProvider) {

  var menuState = {
    name: 'menu',
    url: '/menu',
    template: '<cafe-menu></cafe-menu>',
    controller: 'cafeMenuCtrl'
  };

  var userState = {
    name: 'user',
    url: '/user',
    template: ' <login-form></login-form>' +
    '<user-balance></user-balance>'
  };

  var kitchenState = {
    name: 'kitchen',
    url: '/kitchen',
    template: ' заказанные блюда'
  };

  $stateProvider.state(menuState);
  $stateProvider.state(userState);
  $stateProvider.state(kitchenState);

  $locationProvider.html5Mode(true);


}]);

