global.Valley = {};

require('../server/valley');
require('../valleyjs/lib/tpl');
require('../server/path');

Valley.init({
  root: '..'
});

console.log(Valley._config);

var obj = {
  name: 'company names',
  count: 100,
  list: [
    'sogou',
    'baidu',
    'tencent',
    'alibaba'
  ]
}
Valley.getView('demo').then(function(tpl){
  console.log(tpl);
  var html = Valley.tpl(tpl, obj, {
    title: 'demo'
  });
  console.log(html);
});

// var tpl = '{/*@author gutianyu*/}'
//         + '<test>{g.a} + {this.b} = {g.a + this.b}</test>';
// var obj = {
//   a: 1
// };
// var html = Valley.tpl(tpl, obj, {
//   b: 2
// });
// console.log(tpl);
// console.log(html);
