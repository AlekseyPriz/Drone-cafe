console.log('Приложение подключено');

let app = angular.module('droneCafe', ['ui.router', 'ngRoute']);


app.config(['$stateProvider',
            '$locationProvider',
            '$urlRouterProvider',
              function($stateProvider, $locationProvider, $urlRouterProvider) {

  var startState = {
    name: 'login',
    url: '/login',
    template: '<login-form></login-form>',
    //controller: 'loginCtrl'
  };

  var menuState = {
    name: 'menu',
    url: '/menu',
    template: '<cafe-menu></cafe-menu>',
    controller: 'cafeMenuCtrl'
  };

  var userState = {
    name: 'user',
    url: '/user',
    template: '<user-balance></user-balance>'
  };

  var kitchenState = {
    name: 'kitchen',
    url: '/kitchen',
    template: ' заказанные блюда'
  };

  $stateProvider.state(startState);
  $stateProvider.state(menuState);
  $stateProvider.state(userState);
  $stateProvider.state(kitchenState);

  $urlRouterProvider.otherwise('/login');
  $locationProvider.html5Mode(true);


}]);

