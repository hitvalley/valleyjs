var url = require('url');
var fs = require('fs');
var querystring = require
var express = require('express');

require('./server/valley');

Valley.init({
  root: __dirname,
  webPath: __dirname + '/web',
  viewPath: __dirname + '/web/views',
  vjsPath: __dirname + '/valleyjs',
  linkHost: 'http://127.0.0.1:3007/'
});

var app = express();

fs.readFile(Valley._config.webPath + '/index.html', 'utf8', function(err, data){
  var scriptRegex = /<script[^>]*>.*?<\/script>/g;
  Valley.mainPage = data.replace(scriptRegex, '');
});

app.get('*', function(req, res){
  if (req.url.indexOf('/favicon.ico') >= 0) {
    res.send('');
    return true;
  }
  Valley.run(req, res);
});

app.listen('3008', function(){
  console.log('http://127.0.0.1:3008/demo');
});

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
  console.log('http://127.0.0.1:3007/index.html');
});
