
var fs = require('fs');
var menu;

fs.readFile('menu.json', 'utf8', function (err, data) {
  if (err) throw err;

  console.log(data);

  menu = JSON.parse(data);

  console.log(menu);

});