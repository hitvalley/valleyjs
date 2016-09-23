var url = require('url');
var express = require('express');
var childProcess = require('child_process');
global.appPath = __dirname;
global.hostInfo = '127.0.0.1';

// require('./server/valley');
// require('./config');

// console.log('Valley._config:', Valley._config);

// var app = express();
// app.get('*', function(req, res){
//   if (req.url.indexOf('/favicon.ico') >= 0) {
//     res.send('');
//     return true;
//   }
//   Valley.showPage(req, res);
// });
// app.listen('3008', function(){
//   console.log('http://' + hostInfo + ':3008/demo');
// });

// for dev
var sapp = express();
sapp.use(express.static(__dirname));
sapp.get('/data.json', function(req, res){
  var rInfo = Valley.route(req.url);
  var data = {
    name: 'company names',
    page: rInfo.params.page || 0,
    count: 100,
    list: [
      'sogou',
      'baidu',
      'tencent',
      'alibaba'
    ]
  };
  res.send(data);
});
sapp.post('/post.json', function(req, res){
  res.send('{"test": 1}');
});
sapp.listen('3007', function(){
  var url = 'http://' + hostInfo + ':3007/web/index.html';
  console.log(url);
  childProcess.exec('open ' + url);
});
