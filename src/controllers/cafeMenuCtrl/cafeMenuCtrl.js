app.controller('cafeMenuCtrl', function ($scope) {
  console.log('Подключен cafeMenuCtrl');

  $scope.menu = [
    {
      name: "Макароны по-флотски",
      price: 100
    },
    {
      name: "Картофель в мундирах",
      price: 150
    },
    {
      name: "Сосиски молочные",
      price: 200
    },
    {
      name: "Борщщ",
      price: 300
    }
  ]


});