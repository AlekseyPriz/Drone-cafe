console.log('Приложение подключено');

let app = angular.module('droneCafe', ['ui.router', 'ngRoute']);


app.config([ '$stateProvider', '$locationProvider',   function($stateProvider, $locationProvider) {

  var menuState = {
    name: 'menu',
    url: '/menu',
    template: '<cafe-menu></cafe-menu>'
  };

  var userState = {
    name: 'user',
    url: '/user',
    template: ' <login-form></login-form>' +
    '<user-balance></user-balance>'
  };


  $stateProvider.state(menuState);
  $stateProvider.state(userState);

  $locationProvider.html5Mode(true);


}]);

