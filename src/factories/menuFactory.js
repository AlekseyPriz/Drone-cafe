angular
  .module('droneCafe')
  .factory('menuFactory', function($scope) {

  let socket = io.connect();
  socket.on('get menu', function (data) {
    $scope.menu = data;
    console.log(data);
    socket.emit('menu was received', 'Меню получено');
  });

    return data;
  });
