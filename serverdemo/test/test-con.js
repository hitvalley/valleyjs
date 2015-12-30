require('../server/valley');
require('../valleyjs/valley');
require('../server/path');
require('../server/api');

Valley.init({
  root: '..'
});

var p1 = Valley.getView('demo');
var p2 = Valley.get('/data.json');
// p1.then(function(tpl){
//   console.log(tpl);
// });
// p2.then(function(data){
//   console.log(data);
// });
Promise.all([p1, p2]).then(function(res){
  console.log(arguments);
  var tpl = res[0];
  var data = res[1];
  var html = Valley.tpl(tpl, data, {
    title: 'demo'
  });
  console.log(html);
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});