console.log('Приложение подключено');

let app = angular.module('droneCafe', ['ui.router']);


app.config(function($stateProvider) {

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


});